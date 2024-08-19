import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/dialog/dialog.component';
import AOS from 'aos';

@Component({
  selector: 'app-single-class',
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.css',
})
export class SingleClassComponent implements OnInit {
  @ViewChild('dialogAnchor') dialogAnchor!: ElementRef;
  videoId!: any;

  videos!: any;
  link!: SafeResourceUrl;
  isLoading!: boolean;

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    AOS.init({ once: true });
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.videoId = params.get('id');
    });
    this.getVideo();
  }

  getVideo() {
    this.bunnystreamService.getVideo(this.videoId).subscribe(
      (response: any) => {
        this.videos = response;
        const link = `https://iframe.mediadelivery.net/embed/263508/${this.videos.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
        this.link = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error retrieving videos:', error);
      }
    );
  }

  deleteVideo() {
    // Store the current scroll position
    const scrollPosition = window.pageYOffset;

    // Prevent scrolling
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Delete Video',
        message: 'Are you sure you want to delete this video?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => {
          this.bunnystreamService.deleteVideo(this.videoId).subscribe(
            (response) => {
              console.log('Success deleting video:', response);
              this.showSuccessMessage();
            },
            (error) => {
              console.error('Error retrieving videos:', error);
              this.showErrorMessage();
            }
          );
        },
      } as DialogData,
    });

    dialogRef.afterOpened().subscribe(() => {
      window.scrollTo(0, scrollPosition);
    });
  }

  showSuccessMessage() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'El video ha sido borrado exitosamente',
        message: 'Da click para regresar a todas las clases',
        confirmText: 'Aceptar',
        onConfirm: () => {},
      } as DialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigateByUrl('/');
    });
  }

  showErrorMessage() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Intenta de nuevo',
        message: 'Video no ha podido ser eliminado',
        confirmText: 'Aceptar',
        onConfirm: () => {
          this.bunnystreamService.deleteVideo(this.videoId).subscribe(
            (response) => {
              console.log('Success deleting video:', response);
            },
            (error) => {
              console.error('Error retrieving videos:', error);
            }
          );
        },
      } as DialogData,
    });
  }
}
