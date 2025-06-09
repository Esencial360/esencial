import { Component, OnInit } from '@angular/core';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { Router } from '@angular/router';
import { concatMap, from, map, toArray } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { WorkshopService } from '../../../shared/services/workshop.service';
@Component({
  selector: 'app-all-workshops',
  templateUrl: './all-workshops.component.html',
  styleUrl: './all-workshops.component.css',
})
export class AllWorkshopsComponent {
  videos!: any[];
  loadingClasses: boolean = true;
  pullZone = environment.pullZone;
  workshopsMetadata!: any;
  filteredVideos: any[] = [];

  constructor(
    private bunnyStreamService: BunnystreamService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private workshopService: WorkshopService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getAllClassesMetadata();
    this.getAllClasses();
  }

  getAllClasses() {
    this.bunnyStreamService.getVideosList().subscribe(
      (response) => {
        this.getVideo(response.items);

        if (response.totalItems <= 0) {
          this.loadingClasses = false;
        } else {
          this.getVideo(response.items);
        }
      },
      (error) => {
        console.error('Unable to retrieve classes', error);
      }
    );
  }

  getAllClassesMetadata() {
    this.workshopService.getAllWorkshops().subscribe({
      next: (res) => {
        this.workshopsMetadata = res;
      },
      error: (err) => {
        console.error('Error retrieving classes metadata', err);
      },
    });
  }

  getVideo(videos: any) {
    const videoIdsArray = videos.map((video: { guid: any }) => video.guid);
    if (videoIdsArray.length === 0) {
      return;
    }

    from(videoIdsArray)
      .pipe(
        concatMap((videoId) =>
          this.bunnyStreamService.getVideo(videoId).pipe(
            map((video) => {
              const metadata = this.workshopsMetadata?.find(
                (meta: any) => meta.classId === video.guid
              );

              return {
                video: video,
                safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${
                    video.thumbnailFileName || 'thumbnail.jpg'
                  }`
                ),
                subcategory: metadata?.subcategory || null,
                difficulty: metadata?.difficulty || null,
                instructorId: metadata?.instructorId || null,
              };
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: (videos) => {
          this.videos = videos;
          this.loadingClasses = false;
        },
        error: (error) => {
          console.error('Error retrieving videos:', error);
        },
      });
  }

  onWatchSingleClass(id: string) {
    this.router
      .navigate([`/clases/${id}`])
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

  onFiltersChanged(filtered: any[]) {
    this.filteredVideos = filtered;
  }
}
