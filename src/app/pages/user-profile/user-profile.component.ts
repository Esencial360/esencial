import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
// import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InstructorService } from '../../shared/services/instructor.service';
import { concatMap, from, map, Subject, takeUntil, toArray } from 'rxjs';
import { Instructor } from '../../shared/Models/Instructor';
import { isPlatformBrowser } from '@angular/common';
import { m } from '@lottiefiles/dotlottie-web/dist/index-Dba5bXrL';
import { EmailService } from '../../shared/services/email.service';

interface PreviewInstructor {
  _id: number;
  name: string;
  description: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  profileJson!: string;
  filters: string[] = ['EDITA TU PERFIL'];
  activeFilter: string = this.filters[0];
  dropdownClosed: boolean = true;
  passwordForm!: FormGroup;
  message: string = '';
  instructors: any;
  user: any;
  userId: any;
  instructor!: Instructor;
  videos!: any[];
  pendingVideos: string[] = [];
  isLoading!: boolean;
  roles!: string;
  showModal!: boolean;
  linkVideo!: SafeResourceUrl;
  resultReviewAction!: string;
  showModalAfterAction!: boolean;
  activeVideoId!: string;
  observationReason!: string;
  favoriteClasses = [
    {
      name: 'Clase 1',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 2',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 3',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
  ];

  previousClasses = [
    {
      name: 'Clase 1',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 2',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
    {
      name: 'Clase 3',
      description: 'Lorem impsum',
      instructor: 'John Smith',
      duration: 500,
      difficulty: 'Beginner',
    },
  ];

  badges = [
    {
      name: 'Badge 1',
    },
    {
      name: 'Badge 2',
    },
    {
      name: 'Badge 3',
    },
    {
      name: 'Badge 4',
    },
    {
      name: 'Badge 5',
    },
    {
      name: 'Badge 6',
    },
  ];
  futureBadges = [
    {
      name: 'Badge 1',
    },
    {
      name: 'Badge 2',
    },
    {
      name: 'Badge 3',
    },
    {
      name: 'Badge 4',
    },
    {
      name: 'Badge 5',
    },
    {
      name: 'Badge 6',
    },
  ];
  filteredInstructors: PreviewInstructor[] | undefined;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private emailService: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  async ngOnInit() {
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      this.authService.user$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user) => {
          if (user) {
            this.isLoading = false;
            this.user = user;
          }
          this.authService.user$.subscribe((user) => {
            if (user) {
              const namespace = 'https://test-assign-roles.com';
              this.roles = user[`${namespace}roles`][0] || [];
              this.setFilters();
            }
          });
          this.getAllInstructors();
        });
    }
    const accessToken = await this.authService.getAccessTokenSilently({
      authorizationParams: {
        scope: 'update:current_user_metadata',
      },
    });
  }

  async getAllInstructors() {
    await this.refreshInstructors();
  }

  async refreshInstructors() {
    this.instructorService.getAllInstructors().subscribe((instructors) => {
      this.instructors = instructors;
      this.filteredInstructors = this.instructors;
      this.pendingVideos = [];

      if (this.roles === 'Admin') {
        instructors.forEach((instructor) => {
          (instructor.videos ?? [])
            .filter((video) => video.status === 'Pending')
            .forEach((video) => {
              this.pendingVideos.push(video.videoId);
            });
        });

        this.getVideo(this.pendingVideos);
      }
    });
  }

  async getVideo(videoIds: any) {
    if (videoIds.length === 0) {
    } else if (videoIds.length === 1) {
      from(videoIds)
        .pipe(
          concatMap((videoId) => this.bunnystreamService.getVideo(videoId)),
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
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    } else if (videoIds.length > 1) {
      from(videoIds)
        .pipe(
          concatMap((videoId) => this.bunnystreamService.getVideo(videoId)),
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
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    }
    this.isLoading = false;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;

    try {
      // await this.changePassword(newPassword);
      this.message = 'Password changed successfully';
      this.passwordForm.reset();
    } catch (error) {
      this.message = 'Error changing password. Please try again.';
      console.error('Error changing password:', error);
    }
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleDropdown() {
    this.dropdownClosed = !this.dropdownClosed;
  }

  // onUploadVideo() {
  //   this.router.navigateByUrl('/nuevo-video');
  // }


  onWatchSingleClass(video: any) {
    const collectionName = this.bunnystreamService.getCollection(
      video.collectionId
    );
    this.router
      .navigate([`/collection/${collectionName}/${video.guid}`])
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

  setFilters() {
    if (this.roles === 'Admin') {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'INSTRUCTORES',
        'VIDEOS PENDIENTES',
      ];
    } else if (this.roles === 'Instructor') {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'MIS CLASES',
        'PAGOS',
        'CODIGO',
      ];
    } else {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'MANEJA TU SUBSCRIPCION',
        'FAVORITOS',
        'BADGES',
      ];
    }
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

}
