import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { selectUsers, selectAllUsers } from '../../../state/user.selectors';
import { Store } from '@ngrx/store';

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
  roles!: string;
  isLiked = false;
  userId!: string;
  private ngUnsubscribe = new Subject<void>();
  users$!: any;

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private likedClassesService: LikedClassesService,
    private userService: UserService,
    private store: Store
  ) {
    this.users$ = this.store.select(selectAllUsers).subscribe((users) => {
      console.log('Users from store:', users);
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // AOS.init({ once: true });
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.videoId = params.get('id');
    });
    this.getVideo();

    this.authService.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.authService.user$.subscribe((user) => {
          if (user) {
            const namespace = 'https://test-assign-roles.com';
            this.roles = user[`${namespace}roles`][0] || [];
            this.userService.getUser(user.email).subscribe({
              next: (response) => {
                this.userId = response._id;
                this.likedClassesService.getLikedVideos(this.userId).subscribe(
                  (likedVideos) => {
                    this.isLiked =
                      Array.isArray(likedVideos.likedVideos) &&
                      likedVideos.likedVideos.includes(this.videoId);
                  },
                  (error) => {
                    console.log('error getting liked video', error);
                  }
                );
              },
              error: (error) => {
                console.error('Error user retreival:', error);
              },
            });
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

  toggleLike() {
    this.likedClassesService
      .toggleVideoLike(this.videoId, this.userId)
      .subscribe(
        (response) => {
          this.isLiked = true;
        },
        (error) => {
          console.error('Error toggling like:', error);
          this.isLiked = true;
        }
      );
  }
}
