import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Instructor } from '../../../shared/Models/Instructor';
import { InstructorService } from '../../../shared/services/instructor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { concatMap, from, map, toArray } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-admin-view',
  templateUrl: './instructor-admin-view.component.html',
  styleUrl: './instructor-admin-view.component.css',
})
export class InstructorAdminViewComponent {
  instructorId: any;
  bannerImageUrl = 'assets/images/banner-image.jpg';
  instagramIconUrl = 'assets/images/instagram-icon.png';
  globeIconUrl = 'assets/images/globe-icon.png';
  profileImageUrl = 'assets/images/profile-image.jpg';
  instagramUrl = 'https://www.instagram.com/your-instagram-handle';
  websiteUrl = 'https://www.your-website.com';
  instructor!: Instructor;
  videos!: any[];
  loadingClasses!: boolean;
  pullZone = environment.pullZone;
  confirmDelete!: boolean;

  links: SafeResourceUrl[] = [];

  editMode = false;
  updateInstructorForm!: FormGroup;
  selectedFileUpdateInstructor: File | null = null;
  onSubmittingUpdateForm = false;
  error!: any;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder
  ) {}

  @Input() adminView!: boolean;
  @Input() imageUrl: string = '../../../../assets/images/yoga.jpg';
  @Input() name: string = 'Name lastname';
  @Input() description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

  async ngOnInit() {
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe((params) => {
      this.instructorId = params.get('id');
    });

    await this.instructorService.getInstructor(this.instructorId).subscribe(
      (response) => {
        this.instructor = response;
        this.getVideo(this.instructor.videos);
      },
      (error) => {
        console.error('Instructor get error', error);
      }
    );
    this.initializeUpdateForm();
  }

  initializeUpdateForm() {
    this.updateInstructorForm = this.fb.group({
      firstname: [this.instructor.firstname, Validators.required],
      lastname: [this.instructor.lastname, Validators.required],
      email: [this.instructor.email, [Validators.required, Validators.email]],
      title: [this.instructor.title],
      description: [this.instructor.description],
    });
  }

  getVideo(videos: any) {
    this.loadingClasses = true;
    const videoIdsArray = videos.map(
      (video: { videoId: any }) => video.videoId
    );
    if (videoIdsArray.length === 0) {
      this.loadingClasses = false;
    } else if (videoIdsArray.length === 1) {
      from(videoIdsArray)
        .pipe(
          concatMap((videoId) =>
            this.bunnystreamService.getVideo('video', videoId)
          ),
          map((video) => ({
            video: video,
            safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://vz-4422bc83-71b.b-cdn.net/${video.guid}/thumbnail.jpg`
            ),
          })),
          toArray()
        )
        .subscribe({
          next: (videos) => {
            this.videos = videos;
            this.loadingClasses = false;
          },
          error: (error) => {
            this.loadingClasses = false;
            console.error('Error retrieving videos:', error);
          },
        });
    } else if (videoIdsArray.length > 1) {
      from(videoIdsArray)
        .pipe(
          concatMap((videoId) =>
            this.bunnystreamService.getVideo('video', videoId)
          ),
          map((video) => ({
            video: video,
            safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${video.thumbnailFileName}`
            ),
          })),
          toArray()
        )
        .subscribe({
          next: (videos) => {
            this.videos = videos;
            this.loadingClasses = false;
          },
          error: (error) => {
            this.loadingClasses = false;
            console.error('Error retrieving videos:', error);
          },
        });
    }
  }
  onWatchSingleClass(video: any) {
    this.router
      .navigate([`/clases/${video}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to class successful');
        } else {
          console.error('Navigation to class failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  onRemoveInstructor() {
    this.instructorService.deleteInstructor(this.instructorId).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
        this.confirmDelete = false;
      },
      error: (error) => {
        console.log('Instructor removed error', error);
        this.confirmDelete = false;
      },
    });
  }

  deleteConfirmation() {
    this.confirmDelete = true;
  }

  onCancel() {
    this.confirmDelete = false;
  }

  getDescriptionParagraphs(description: string): string[] {
    return description
      .split('.')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.initializeUpdateForm();
    } else {
      this.selectedFileUpdateInstructor = null;
    }
  }

  onFileSelectedUpdateInstructor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFileUpdateInstructor = target.files[0];
    }
  }

  onSubmitUpdateInstructor() {
    if (this.updateInstructorForm.valid) {
      this.onSubmittingUpdateForm = true;
      const formData = new FormData();

      formData.append('_id', this.instructor._id ? this.instructor._id : '');

      formData.append('firstname', this.updateInstructorForm.value.firstname);
      formData.append('lastname', this.updateInstructorForm.value.lastname);
      formData.append('title', this.updateInstructorForm.value.title);
      formData.append('email', this.updateInstructorForm.value.email);
      formData.append(
        'description',
        this.updateInstructorForm.value.description
      );

      if (this.selectedFileUpdateInstructor) {
        formData.append('profilePicture', this.selectedFileUpdateInstructor);
      }

      console.log(formData);
      

      this.instructorService.updateInstructor(formData).subscribe({
        next: (response) => {
          this.instructor = { ...this.instructor, ...response };

          this.onSubmittingUpdateForm = false;
          this.editMode = false;
          this.selectedFileUpdateInstructor = null;

        },
        error: (error) => {
          console.log('Error updating instructor', error);
          this.onSubmittingUpdateForm = false;
          this.error = error;
        },
      });
    }
  }

  cancelUpdate() {
    this.editMode = false;
    this.selectedFileUpdateInstructor = null;
    this.updateInstructorForm.reset();
  }
}
