import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { InstructorService } from '../../../shared/services/instructor.service';
import {
  catchError,
  filter,
  from,
  map,
  mergeMap,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  toArray,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from '../../../shared/Models/User';
import { selectActiveUser } from '../../../state/user.selectors';
import { DomSanitizer } from '@angular/platform-browser';
import { Instructor } from '../../../shared/Models/Instructor';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrl: './instructor-profile.component.css',
})
export class InstructorProfileComponent implements OnInit {
  @Input() filters!: string[];

  user$!: any;
  videos!: any[];
  userId!: string;
  instructor!: any;
  pendingVideosCount!: number
  totalVideosCount!: number

  payments = [
    {
      month: 'MAYO',
      amount: 459.32,
    },
    {
      month: 'JUNIO',
      amount: 459.32,
    },
    {
      month: 'JULIO',
      amount: 459.32,
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private bunnystreamService: BunnystreamService,
    private instructorService: InstructorService,
    private store: Store,
    private sanitizer: DomSanitizer
  ) {
    this.user$ = this.store.select(selectActiveUser).subscribe((user) => {
      this.userId = user._id;
    });
  }

  ngOnInit(): void {
    console.log(this.userId)
    this.instructorService
      .getInstructor(this.userId)
      .pipe(
        tap((response) =>
          console.log('Instructor fetched successfully', response)
        ), // ✅ Log response
        filter((instructor) => !!instructor), // ✅ Ensure instructor exists
        tap((instructor) => {
          this.instructor = instructor; // ✅ Store instructor in component

          // Count pending videos
          this.pendingVideosCount =
            instructor.videos?.filter((video) => video.status === 'Pending')
              .length || 0;

          // Count total videos (pending + approved)
          this.totalVideosCount = instructor.videos?.length || 0;

          console.log(
            `Pending videos: ${this.pendingVideosCount}, Total videos: ${this.totalVideosCount}`
          );
        }),
        map((instructor) =>
          instructor.videos?.find((video) => video.status === 'approve')
        ), // ✅ Find active video
        filter((activeVideo) => !!activeVideo), // ✅ Only proceed if an approved video is found
        switchMap(async (activeVideo) => this.getVideo(activeVideo!.videoId)), // ✅ Fetch video details
        takeUntil(this.destroy$) // ✅ Cleanup on component destroy
      )
      .subscribe({
        next: (video) => console.log('Video retrieved:', video),
        error: (error) => console.error('Error:', error),
      });
  }

  getVideo(videoIds: string | string[]) {
    if (!videoIds || (Array.isArray(videoIds) && videoIds.length === 0)) {
      console.warn('No video IDs provided.');
      return;
    }

    const videoIdArray = Array.isArray(videoIds) ? videoIds : [videoIds];

    from(videoIdArray)
      .pipe(
        mergeMap((videoId) =>
          this.bunnystreamService.getVideo(videoId).pipe(
            catchError((error) => {
              console.error(`Error fetching video ID ${videoId}:`, error);
              return of(null); // Return a null placeholder to avoid breaking the stream
            }),
            map((video) =>
              video
                ? {
                    video,
                    safeThumbnail:
                      this.sanitizer.bypassSecurityTrustResourceUrl(
                        `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${video.thumbnailFileName}`
                      ),
                  }
                : null
            )
          )
        ),
        filter((video) => video !== null), // Remove null placeholders
        toArray(),
        takeUntil(this.destroy$) // Ensure cleanup when component is destroyed
      )
      .subscribe({
        next: (videos) => {
          this.videos = videos;
          console.log('Retrieved videos:', this.videos);
        },
        error: (error) => {
          console.error('Error retrieving videos:', error);
        },
      });
  }

  // onShowTab(tabName: string) {
  //   this.filterAction.emit(tabName);
  // }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

  onUploadVideo() {
    this.router.navigateByUrl('/nuevo-video');
  }

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
}
