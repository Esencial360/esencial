import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
// import { AuthService } from '../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BunnystreamService } from '../../shared/services/bunny-stream.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InstructorService } from '../../shared/services/instructor.service';
import { concatMap, from, map, Subject, takeUntil, toArray } from 'rxjs';
import { Instructor } from '../../shared/Models/Instructor';
import { isPlatformBrowser } from '@angular/common';

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
  filters: string[] = [
    'EDITA TU PERFIL',
    'CAMBIA TU CONTRASEÑA',
    'MANEJA TU SUBSCRIPCION',
    'MIS CLASES',
    'INSTRUCTORES'
  ];
  activeFilter: string = this.filters[0];
  dropdownClosed: boolean = true;
  passwordForm!: FormGroup;
  message: string = '';
  instructors: any;
  user: any;
  userId: any;
  instructor!: Instructor;
  videos!: any[];
  isLoading!: boolean;
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
        this.user = user;
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
    this.instructorService.getAllInstructors().subscribe(
      (instructors) => {
        this.instructors = instructors;
        this.filteredInstructors = this.instructors;
        const matchingObject = this.filteredInstructors?.find(
          (obj) => obj.email === this.user.email
        );
        if (matchingObject) {
          this.userId = matchingObject?._id.toString();
          this.instructorService.getInstructor(this.userId).subscribe(
            (response) => {
              console.log('Instructor get successfully', response);
              this.instructor = response;
              console.log(this.instructor.videos);
              this.getVideo(this.instructor.videos);
            },
            (error) => {
              console.error('Instructor get error', error);
            }
          );
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
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

  // async changePassword(newPassword: string) {
  //   // const accessToken = await this.authService.getAccessTokenSilently({
  //   //   authorizationParams: {
  //   //     scope: 'update:current_user_metadata',
  //   //   },
  //   // });

  //   const userId = await this.authService.user$.subscribe((user) => user?.sub);

  //   const url = `https://dev-syvyfpm6kjwu0kzp.us.auth0.com/api/v2/users/${userId}`;

  //   const headers = {
  //     Authorization: `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json',
  //   };

  //   const body = {
  //     password: newPassword,
  //   };

  //   try {
  //     await this.http.patch(url, body, { headers }).toPromise();
  //     console.log('Password changed successfully');
  //   } catch (error) {
  //     console.error('Error changing password:', error);
  //   }
  // }

  applyFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleDropdown() {
    this.dropdownClosed = !this.dropdownClosed;
  }

  onUploadVideo() {
    this.router.navigateByUrl(
      '/nuevo-video'
    )
  }

  onInstructor(id: number) {
    this.router.navigate([`/instructor-previa/${id}`])
    console.log('navigate');
    
  }

  onWatchSingleClass(video: any) {
    const collectionName = this.bunnystreamService.getCollection(
      video.collectionId
    );
    console.log(collectionName);
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
}
