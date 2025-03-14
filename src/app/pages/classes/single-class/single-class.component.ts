import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';
import AOS from 'aos';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';
import { LikedClassesService } from '../../../shared/services/liked-classes.service';
import { UserService } from '../../../shared/services/users.service';
import {
  selectAllUsers,
  selectActiveUser,
} from '../../../state/user.selectors';
import { Store } from '@ngrx/store';
import { ActiveUserApiActions } from '../../../state/user.actions';
import { Location } from '@angular/common';


declare global {
  interface Window {
    BunnyPlayer: any;
  }
}

@Component({
  selector: 'app-single-class',
  templateUrl: './single-class.component.html',
  styleUrl: './single-class.component.css',
})
export class SingleClassComponent implements OnInit {
  
  @ViewChild('dialogAnchor') dialogAnchor!: ElementRef;
  @ViewChild('bunnyVideo') videoIframe!: ElementRef;
  videoId!: any;

  videos!: any;
  link!: SafeResourceUrl;
  isLoading!: boolean;
  roles!: string;
  isLiked = false;
  userId!: string;
  private ngUnsubscribe = new Subject<void>();
  users$!: any;
  user$!: any;
  user!: any;
  class = {
    title: 'FLUYE CONSCIENTE CON LULÚ FRAGA',
    duration: '30 MIN',
    level: 'I/A',
    description: 'En esta clase de Vinyasa aprenderás a postergar la ansiedad. Saldrás para mejorar la resistencia, aumentar la flexibilidad y encontrar un flujo continuo en tu práctica.',
    items: [
      { icon: 'yoga-mat', text: 'Tapete de yoga' },
      { icon: 'water-bottle', text: 'Botella de agua' },
      { icon: 'towel', text: 'Toalla corta' }
    ],
    recommendations: [
      { icon: 'sunrise', text: 'Al despertar' },
      { icon: 'bowl', text: 'Uso de cuencos' },
      { icon: 'sun', text: 'Al aire libre para recibir la energía del sol' },
      { icon: 'blocks', text: 'Uso de bloques' }
    ]
  };
  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private likedClassesService: LikedClassesService,
    private store: Store,
    private location: Location
  ) {
    this.user$ = this.store.select(selectActiveUser).subscribe((user) => {
      this.userId = user._id;
      this.user = user;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.videoId = params.get('id');
    });
    this.isLiked = this.user.likedVideos.includes(this.videoId);
    this.getVideo();

    this.authService.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.authService.user$.subscribe((user) => {
          if (user) {
            const namespace = 'https://test-assign-roles.com';
            this.roles = user[`${namespace}roles`][0] || [];
            this.isLoading = false;
          }
        });
      });
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
    const scrollPosition = window.pageYOffset;
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

  toggleLike() {
    this.likedClassesService
      .toggleVideoLike(this.videoId, this.userId)
      .subscribe(
        (response) => {
          this.store.dispatch(
            ActiveUserApiActions.retrievedActiveUser({
              user: response,
            })
          );
          this.isLiked = this.user.likedVideos.includes(this.videoId);
        },
        (error) => {
          console.error('Error toggling like:', error);
          this.isLiked = this.user.likedVideos.includes(this.videoId);
        }
      );
  }

  goBack() {
    this.location.back();
  }
}
