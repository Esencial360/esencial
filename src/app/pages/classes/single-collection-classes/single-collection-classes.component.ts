import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from, map, toArray } from 'rxjs';
import AOS from "aos";

@Component({
  selector: 'app-single-collection-classes',
  templateUrl: './single-collection-classes.component.html',
  styleUrl: './single-collection-classes.component.css',
})
export class SingleCollectionClassesComponent implements OnInit {
  collectionList!: any[];

  collectionName: any;

  matchingCollection!: any[];

  videos!: any[];

  links: SafeResourceUrl[] = [];

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0); 
    this.route.paramMap.subscribe((params) => {
      this.collectionName = params.get('id');
      console.log(this.collectionName);
    });
    this.getCollectionList();
    AOS.init({
      once: true
    });
  }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
        console.log(this.collectionList);
        function findMatchingObject(dataArray: any, name: string) {
          return dataArray.find((item: { name: string }) => item.name === name);
        }
        this.matchingCollection = findMatchingObject(
          this.collectionList,
          this.collectionName
        );
        // this.getVideosOfCollection(this.matchingCollection);
        this.getVideo(this.matchingCollection);
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
  }

  getVideo(videoIds: any) {
    const videoIdsArray = videoIds.previewVideoIds.split(',');
    console.log(videoIdsArray)
    if (videoIdsArray.length === 0) {
    } else if (videoIdsArray.length === 1) {
      // this.bunnystreamService.getVideo(videoIds.previewVideoIds).subscribe(
      //   (response: any) => {
      //     this.videos = [response];
      //     this.links = this.videos.map((video) => {
      //       const link = `https://vz-4422bc83-71b.b-cdn.net/${video.guid}/thumbnail.jpg`;
      //       return this.sanitizer.bypassSecurityTrustResourceUrl(link);
      //     });
      //     console.log(this.videos)
      //   },
      //   (error) => {
      //     console.error('Error retrieving videos:', error);
      //   }
      // );
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
          console.log(this.videos)
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
            console.log(this.videos)
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    }
  }

  onWatchSingleClass(id: string) {
    this.router.navigate([`/collection/${this.collectionName}/${id}`]).then((navigationSuccess) => {
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
