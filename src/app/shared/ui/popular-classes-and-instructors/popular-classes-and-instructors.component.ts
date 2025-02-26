import { Component, OnInit } from '@angular/core';
import { BunnystreamService } from '../../services/bunny-stream.service';
import { concatMap, from, map, toArray } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-popular-classes-and-instructors',
  templateUrl: './popular-classes-and-instructors.component.html',
  styleUrl: './popular-classes-and-instructors.component.css',
})
export class PopularClassesAndInstructorsComponent implements OnInit {
  classes!: any[];
  instructors!: any[];
  loadingClasses: boolean = true;

  constructor(
    private bunnystreamService: BunnystreamService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getPopularClasses();
    this.instructors = [
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
    ];
  }

  getPopularClasses() {
    this.bunnystreamService.getVideosList('3').subscribe(
      (response) => {
        const limitedVideos = response.items.slice(0, 3);
        this.getVideo(limitedVideos);
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
            this.classes = videos;
            this.loadingClasses = false;
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
            this.classes = videos;
            
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
