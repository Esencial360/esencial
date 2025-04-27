import { Component, OnInit } from '@angular/core';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { Router } from '@angular/router';
import { concatMap, from, map, toArray } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-all-classes',
  templateUrl: './all-classes.component.html',
  styleUrl: './all-classes.component.css',
})
export class AllClassesComponent implements OnInit {
  videos!: any[];
  loadingClasses: boolean = true;
  pullZone = environment.pullZone;

  constructor(
    private bunnyStreamService: BunnystreamService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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

  getVideo(videos: any) {
    const videoIdsArray = videos.map((video: { guid: any }) => video.guid);
    if (videoIdsArray.length === 0) {
    } else if (videoIdsArray.length === 1) {
      from(videoIdsArray)
        .pipe(
          concatMap((videoId) => this.bunnyStreamService.getVideo(videoId)),
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
            console.error('Error retrieving videos:', error);
          },
        });
    } else if (videoIdsArray.length > 1) {
      from(videoIdsArray)
        .pipe(
          concatMap((videoId) => this.bunnyStreamService.getVideo(videoId)),
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
            console.error('Error retrieving videos:', error);
          },
        });
    }
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
}
