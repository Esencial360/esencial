import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectActiveUser } from '../../../state/user.selectors';
import { concatMap, from, map, Observable, toArray } from 'rxjs';
import { Store } from '@ngrx/store';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent implements OnInit {
  user$!: any;
  @Input() filters!: string[];

  passwordForm!: FormGroup;
  message!: string;
  videos!: any;
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

  favoriteClasses = [];

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

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer
  ) {
    this.user$ = this.store.select(selectActiveUser);
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.user$.subscribe((user: any) => this.getVideo(user.likedVideos));
  }

  getVideo(videos: any) {
    const videoIdsArray = videos;
    if (videoIdsArray.length === 0) {
    } else if (videoIdsArray.length === 1) {
      from(videoIdsArray)
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
            console.log(this.videos);
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    } else if (videoIdsArray.length > 1) {
      from(videoIdsArray)
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
            console.log(this.videos);
            
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    }
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
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
      this.message = 'Password changed successfully';
      this.passwordForm.reset();
    } catch (error) {
      this.message = 'Error changing password. Please try again.';
      console.error('Error changing password:', error);
    }
  }
}
