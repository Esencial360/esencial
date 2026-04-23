import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { catchError, of, switchMap, take } from 'rxjs';
import { InstructorService } from '../../../shared/services/instructor.service';
import { Instructor } from '../../../shared/Models/Instructor';
import { Router } from '@angular/router';
import { ClassesService } from '../../../shared/services/classes.service';
import { Classes } from '../../../shared/Models/Classes';
import { CategoryConfig } from '../../../shared/Models/CategoryConfig';
import { CategoryConfigService } from '../../../shared/services/category-config.service';
import { NgZone } from '@angular/core';

interface UploadVideo { title: string; collectionId: string; }
interface VideoResponse {
  videoLibraryId: number; guid: string; title: string;
  dateUploaded: string; views: number;
}

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css',
})
export class UploadVideoComponent implements OnInit, OnDestroy {
  videoData!: UploadVideo;
  collectionList: any[] = [];
  newVideoForm!: FormGroup;
  selectedFile!: File;
  isModalOpen = false;
  firstStep = true;
  secondStep = false;
  thirdStep = false;
  videoId!: string;
  instructors!: Instructor[];
  loading = false;
  isUploading = false;
  uploadingProgress!: string;
  categoryConfigs: CategoryConfig[] = [];

  // Track whether upload was intentionally aborted so we skip the verify loop
  private uploadAborted = false;
  // Track whether we're mid-verification so ngOnDestroy can clean up
  private isVerifying = false;

  /** Intercept page reload/close while upload is in progress */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isUploading || this.isVerifying) {
      // Delete the orphan slot synchronously — best effort
      this.cleanupOrphan();
      // Show browser's native "leave page?" dialog
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    // Component destroyed mid-upload (route change etc.) — clean up
    if ((this.isUploading || this.isVerifying) && this.videoId) {
      this.uploadAborted = true;
      this.cleanupOrphan();
    }
  }

  constructor(
    private bunnyStreamService: BunnystreamService,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    private classesService: ClassesService,
    private configService: CategoryConfigService,
    private ngZone: NgZone,
  ) {
    this.newVideoForm = this.fb.group({
      title: ['', Validators.required],
      collectionId: ['', Validators.required],
      instructor: [''],
      difficulty: ['', Validators.required],
      subcategory: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getCollectionList();
    this.loadCategoryConfigs();
    this.instructorService.getAllInstructors().subscribe({
      next: (response) => this.instructors = response,
      error: (error) => console.error('Instructors error', error),
    });
  }

  loadCategoryConfigs() {
    this.configService.getCategoryConfigs().subscribe({
      next: (configs) => this.categoryConfigs = configs,
      error: (err) => console.error('Error loading category configs', err),
    });
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  getCollectionList() {
    this.bunnyStreamService.getCollectionList().subscribe({
      next: (response: any) => this.collectionList = response.items,
      error: (error) => console.error('Error retrieving collection:', error),
    });
  }

  onSubmit() {
    if (this.newVideoForm.valid) {
      this.firstStep = false;
      this.secondStep = true;
    }
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) this.selectedFile = files[0];
  }

  createVideo() {
    if (this.isUploading || !this.selectedFile) return;
    this.isUploading = true;

    const { title, collectionId } = this.newVideoForm.value;

    this.bunnyStreamService
      .createVideo(title, collectionId, 5000)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.videoId = response.guid;
          this.startTusUpload();
        },
        error: (error) => {
          console.error('Error creating video slot on Bunny:', error);
          this.isUploading = false;
        },
      });
  }

  private startTusUpload() {
    const { title, collectionId } = this.newVideoForm.value;
    this.loading = true;

    this.bunnyStreamService.uploadVideoWithTus(
      'video',
      this.selectedFile,
      this.videoId,
      title,
      collectionId,
      // onSuccess — TUS confirmed bytes received, now VERIFY before writing DB
      () => {
        this.ngZone.run(() => {
          console.log('TUS complete — verifying Bunny has the file...');
          this.verifyThenSave(this.videoId);
        });
      },
      // onError — upload failed, delete the orphan Bunny slot
      (error) => {
        this.ngZone.run(() => {
          console.error('TUS upload failed:', error);
          this.loading = false;
          this.isUploading = false;
          this.deleteOrphanFromBunny(this.videoId);
        });
      },
      (progress) => {
        this.ngZone.run(() => {
          this.uploadingProgress = progress.toFixed(2);
        });
      },
    );
  }

  /**
   * Poll Bunny until storageSize > 0 (file actually exists on their servers),
   * then write to DB. If verification fails after max retries, delete the
   * orphan from Bunny and do NOT write to DB.
   */
  private verifyThenSave(videoId: string, attempt = 0, maxAttempts = 10, delayMs = 3000) {
    // If upload was aborted mid-verify, stop the loop immediately
    if (this.uploadAborted) {
      console.warn('Verification aborted — upload was cancelled');
      return;
    }

    this.isVerifying = true;

    this.bunnyStreamService.getVideo('video', videoId).pipe(take(1)).subscribe({
      next: (bunnyVideo: any) => {
        if (this.uploadAborted) return; // check again after async response

        const hasBytes = bunnyVideo?.storageSize > 0;

        if (hasBytes) {
          console.log(`Bunny confirmed storageSize=${bunnyVideo.storageSize} — writing to DB`);
          this.isVerifying = false;
          this.loading = false;
          this.isUploading = false;
          this.secondStep = false;
          this.thirdStep = true;
          this.saveToDatabase(videoId);
        } else if (attempt < maxAttempts) {
          console.log(`Bunny storageSize=0, retrying (${attempt + 1}/${maxAttempts})...`);
          setTimeout(() => this.verifyThenSave(videoId, attempt + 1, maxAttempts, delayMs), delayMs);
        } else {
          console.error('Bunny verification failed after max retries — aborting DB write');
          this.isVerifying = false;
          this.loading = false;
          this.isUploading = false;
          this.cleanupOrphan();
        }
      },
      error: (err) => {
        if (this.uploadAborted) return;
        console.error('Error verifying video on Bunny:', err);
        if (attempt < maxAttempts) {
          setTimeout(() => this.verifyThenSave(videoId, attempt + 1, maxAttempts, delayMs), delayMs);
        } else {
          this.isVerifying = false;
          this.loading = false;
          this.isUploading = false;
          this.cleanupOrphan();
        }
      },
    });
  }

  private cleanupOrphan() {
    if (!this.videoId) return;
    const idToDelete = this.videoId;
    this.videoId = ''; // prevent double-delete
    this.bunnyStreamService.deleteVideo('video', idToDelete).pipe(take(1)).subscribe({
      next: () => console.warn('Orphan Bunny slot deleted:', idToDelete),
      error: (e) => console.error('Failed to delete orphan from Bunny:', e),
    });
  }

  private deleteOrphanFromBunny(videoId: string) {
    this.cleanupOrphan();
  }

  // Only called after Bunny confirms storageSize > 0
  private saveToDatabase(videoId: string) {
    console.log('Verified — saving to DB');
    const selectedInstructor = this.instructors.find(
      (i) => i._id === this.newVideoForm.value.instructor,
    );

    const classVideo: Classes = {
      classId: videoId,
      instructorId: selectedInstructor?._id ?? '',
      difficulty: this.newVideoForm.value.difficulty,
      subcategory: this.newVideoForm.value.subcategory,
    };

    this.classesService.createClass(classVideo).pipe(
      switchMap(() => {
        if (!selectedInstructor) return of(null);
        const updatedInstructor: Instructor = {
          ...selectedInstructor,
          videos: [
            ...(selectedInstructor.videos ?? []),
            { videoId, status: 'Pending' },
          ],
        };
        return this.instructorService.updateInstructor(updatedInstructor);
      }),
      catchError((err) => {
        console.error('DB write failed — video is on Bunny but not in DB:', err);
        return of(null);
      }),
    ).subscribe({
      next: () => console.log('DB saved successfully'),
    });
  }

  onProcessDone() { this.router.navigate(['/home']); }

  getSubcategories(): string[] {
    const collectionId = this.newVideoForm.get('collectionId')?.value;
    return this.categoryConfigs.find(c => c.collectionId === collectionId)?.subcategories ?? [];
  }
}