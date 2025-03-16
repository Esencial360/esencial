import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../../shared/services/instructor.service';
import { Instructor } from '../../../shared/Models/Instructor';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from, map, toArray } from 'rxjs';
import AOS from 'aos';

@Component({
  selector: 'app-single-instructor',
  templateUrl: './single-instructor.component.html',
  styleUrl: './single-instructor.component.css',
})
export class SingleInstructorComponent implements OnInit {
  instructorId: any;
  bannerImageUrl = 'assets/images/banner-image.jpg';
  instagramIconUrl = 'assets/images/instagram-icon.png';
  globeIconUrl = 'assets/images/globe-icon.png';
  profileImageUrl = 'assets/images/profile-image.jpg';
  instagramUrl = 'https://www.instagram.com/your-instagram-handle';
  websiteUrl = 'https://www.your-website.com';
  instructor!: Instructor;
  videos!: any[];

  links: SafeResourceUrl[] = [];

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  @Input() adminView!: boolean;
  @Input() imageUrl: string = '../../../../assets/images/yoga.jpg';
  @Input() name: string = 'Name lastname';
  @Input() description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

  async ngOnInit() {
    AOS.init({ once: true });
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe((params) => {
      this.instructorId = params.get('id');
      // fetch instructor details based on the instructorId
    });

    await this.instructorService.getInstructor(this.instructorId).subscribe(
      (response) => {
        console.log('Instructor get successfully', response);
        this.instructor = response;
        const activeVideo = this.instructor.videos?.find(
          (video) => video.status === 'approve'      
        );
        console.log(activeVideo);
        
        if (activeVideo) {
          this.getVideo(activeVideo.videoId); // Pass only videoId
        }
      },
      (error) => {
        console.error('Instructor get error', error);
      }
    );
  }

  getVideo(videoIds: string | string[]) {
    if (!videoIds) {
      console.warn('No video IDs provided.');
      return;
    }
  
    const videoIdArray = Array.isArray(videoIds) ? videoIds : [videoIds];
  
    from(videoIdArray)
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
          console.log('Retrieved videos:', this.videos);
        },
        error: (error) => {
          console.error('Error retrieving videos:', error);
        },
      });
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
