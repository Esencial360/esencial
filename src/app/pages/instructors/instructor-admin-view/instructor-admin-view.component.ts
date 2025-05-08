import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Instructor } from '../../../shared/Models/Instructor';
import { InstructorService } from '../../../shared/services/instructor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { concatMap, from, map, toArray } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-instructor-admin-view',
  templateUrl: './instructor-admin-view.component.html',
  styleUrl: './instructor-admin-view.component.css',
})
export class InstructorAdminViewComponent {
  instructorId: any;
  bannerImageUrl = 'assets/images/banner-image.jpg';
  instagramIconUrl = 'assets/images/instagram-icon.png';
  globeIconUrl = 'assets/images/globe-icon.png';
  profileImageUrl = 'assets/images/profile-image.jpg';
  instagramUrl = 'https://www.instagram.com/your-instagram-handle';
  websiteUrl = 'https://www.your-website.com';
  instructor!: Instructor;
  videos!: any[];
  loadingClasses!: boolean;
  pullZone = environment.pullZone;

  links: SafeResourceUrl[] = [];

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog
  ) {}

  @Input() adminView!: boolean;
  @Input() imageUrl: string = '../../../../assets/images/yoga.jpg';
  @Input() name: string = 'Name lastname';
  @Input() description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

  async ngOnInit() {
    console.log('single initialized');
    this.route.paramMap.subscribe((params) => {
      this.instructorId = params.get('id');
    });

    await this.instructorService.getInstructor(this.instructorId).subscribe(
      (response) => {
        console.log('Instructor get successfully', response);
        this.instructor = response;
        this.getVideo(this.instructor.videos);
      },
      (error) => {
        console.error('Instructor get error', error);
      }
    );
  }

  getVideo(videos: any) {
    this.loadingClasses = true;
    const videoIdsArray = videos.map(
      (video: { videoId: any }) => video.videoId
    );
    if (videoIdsArray.length === 0) {
      this.loadingClasses = false;
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
            this.videos = videos;
            this.loadingClasses = false;
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    }
  }
  onWatchSingleClass(video: any) {
    this.router
      .navigate([`/clases/${video}`])
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

  onRemoveInstructor() {
    this.instructorService.deleteInstructor(this.instructorId).subscribe({
      next: (response) => {
        console.log('Instructor removed successfully', response);
      },
      error: (error) => {
        console.log('Instructor removed error', error);
      },
    });
  }

  deleteConfirmation() {
    const scrollPosition = window.pageYOffset;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Eliminar instructor',
        message: 'Estas seguro de eliminar el instructor?',
        confirmText: 'Aprovar',
        cancelText: 'Volver',
      } as DialogData,
    });

    dialogRef.afterOpened().subscribe(() => {
      window.scrollTo(0, scrollPosition);
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onRemoveInstructor();
      }
    });
  }

  getDescriptionParagraphs(description: string): string[] {
    return description.split('.').map(p => p.trim()).filter(p => p.length > 0);
  }
}
