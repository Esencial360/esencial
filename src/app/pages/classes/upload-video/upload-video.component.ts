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

  // Track whether upload was intentionally aborted so we skip cleanup
  private uploadAborted = false;

  /** Intercept page reload/close while upload is in progress */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.isUploading) {
      this.cleanupOrphan();
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    if (this.isUploading && this.videoId) {
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
      // onSuccess — TUS confirmed all bytes received by Bunny.
      // Write to DB immediately — no polling needed. The class gets
      // status 'Pending' so it won't surface publicly until approved.
      () => {
        this.ngZone.run(() => {
          console.log('TUS complete — saving to DB');
          this.loading = false;
          this.isUploading = false;
          this.secondStep = false;
          this.thirdStep = true;
          this.saveToDatabase(this.videoId);
        });
      },
      (error) => {
        this.ngZone.run(() => {
          console.error('TUS upload failed:', error);
          this.loading = false;
          this.isUploading = false;
          this.cleanupOrphan();
        });
      },
      (progress) => {
        this.ngZone.run(() => {
          this.uploadingProgress = progress.toFixed(2);
        });
      },
    );
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

  // Only called after Bunny TUS confirms success
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