import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from, map, toArray } from 'rxjs';
import AOS from 'aos';
import { ClassesService } from '../../../shared/services/classes.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-single-collection-classes',
  templateUrl: './single-collection-classes.component.html',
  styleUrl: './single-collection-classes.component.css',
})
export class SingleCollectionClassesComponent implements OnInit {
  collectionList!: any[];
  pullZone = environment.pullZone
  collectionName: any;
  loadingClasses: boolean = true;
  matchingCollection!: any;
  videoIdsArray!: string[]
  videos!: any[];
filteredVideos!: any[]
  links: SafeResourceUrl[] = [];
    classesMetadata!: any;

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private classesService: ClassesService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe((params) => {
      this.collectionName = params.get('id');
    });
        this.getAllClassesMetadata();
    this.getCollectionList();
    AOS.init({
      once: true,
    });
  }

  getCollectionList() {
    this.bunnystreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
        
        function findMatchingObject(dataArray: any, name: string) {
          return dataArray.find((item: { name: string }) => item.name === name);
        }
        this.matchingCollection = findMatchingObject(
          this.collectionList,
          this.collectionName
        );
        console.log(this.collectionName);
        
        // this.getVideo(this.matchingCollection);
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
    this.bunnystreamService
      .getCollectionVideosList(this.collectionName)
      .subscribe(
        (response) => {
          this.getVideo(response.items)
        },
        (error) => {
          console.error('Error retrieving video list collection:', error);
        }
      );
  }

  getAllClassesMetadata() {
    this.classesService.getAllClasses().subscribe({
      next: (res) => {
        this.classesMetadata = res;
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
          this.bunnystreamService.getVideo(videoId).pipe(
            map((video) => {
              const metadata = this.classesMetadata.find(
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
      .navigate([`/collection/${this.collectionName}/${id}`])
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
