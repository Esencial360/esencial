import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../shared/services/users.service';
import {
  selectAllUsers,
  selectActiveUser,
} from '../../../state/user.selectors';
import { Store } from '@ngrx/store';
import { ActiveUserApiActions } from '../../../state/user.actions';
import { Location } from '@angular/common';
import { WorkshopService } from '../../../shared/services/workshop.service';
import { Workshop } from '../../../shared/Models/Workshop';
import { InstructorService } from '../../../shared/services/instructor.service';
import { Instructor } from '../../../shared/Models/Instructor';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    BunnyPlayer: any;
  }
}
@Component({
  selector: 'app-single-workshop',
  templateUrl: './single-workshop.component.html',
  styleUrl: './single-workshop.component.css',
})
export class SingleWorkshopComponent {
  @ViewChild('dialogAnchor') dialogAnchor!: ElementRef;
  @ViewChild('bunnyVideo') videoIframe!: ElementRef;
  videoId!: any;
  pullZone = environment.pullZone;
  videos!: any;
  link!: SafeResourceUrl;
  isLoading!: boolean;
  roles!: string;
  isLiked = false;
  userId!: string;
  workshopInfo!: Workshop;
  instructorInfo!: Instructor;
  forbidden!: boolean;
  users$!: any;
  user$!: any;
  user!: any;
  workshop = {
    title: 'FLUYE CONSCIENTE CON LULÚ FRAGA',
    duration: '30 MIN',
    level: 'I/A',
    description:
      'En esta clase de Vinyasa aprenderás a postergar la ansiedad. Saldrás para mejorar la resistencia, aumentar la flexibilidad y encontrar un flujo continuo en tu práctica.',
    items: [
      { icon: this.pullZone + '/assets/yogaMat.png', text: 'Tapete de yoga' },
      {
        icon: this.pullZone + '/assets/waterBottle.png',
        text: 'Botella de agua',
      },
      { icon: this.pullZone + '/assets/towel.png', text: 'Toalla corta' },
    ],
    recommendations: [
      { icon: this.pullZone + '/assets/wakingUp.png', text: 'Al despertar' },
      { icon: this.pullZone + '/assets/bowl.png', text: 'Uso de cuencos' },
      { icon: this.pullZone + '/assets/sun.png', text: 'Al aire libre' },
      { icon: this.pullZone + '/assets/boxes.png', text: 'Uso de bloques' },
    ],
  };
  private intervalId: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private location: Location,
    private workshopService: WorkshopService,
    private instructorService: InstructorService
  ) {
    this.user$ = this.store.select(selectActiveUser).subscribe((user) => {
      this.userId = user._id;
      this.user = user;
      console.log(this.userId);
      console.log(this.user);
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.videoId = params.get('id');
    });
    this.isLiked = this.user.likedVideos?.includes(this.videoId);
    // this.getVideo();
    this.getVideoInfo();

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.authService.user$.subscribe((user) => {
        if (user) {
          const namespace = 'https://test-assign-roles.com/';
          this.roles = user[`${namespace}roles`][0] || [];
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.user = undefined;
        }
      });
    });
  }

  getVideo() {
    this.bunnystreamService.getVideo('workshop', this.videoId).subscribe(
      (response: any) => {
        this.videos = response;
        const link = `https://iframe.mediadelivery.net/embed/452333/${this.videos.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
        this.link = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error retrieving videos:', error);
      }
    );
  }

  getVideoInfo() {
    this.workshopService.getWorkshop(this.videoId).subscribe({
      next: (response) => {
        this.workshopInfo = response;
        this.getInstructor(response.instructorId);
        this.getVideo();
      },
      error: (error) => {
        console.error('Error retrieved Workshop:', error);
        this.forbidden = true;
      },
      complete: () => {
        console.log('Cration retrieved completed.');
      },
    });
  }

  getInstructor(instructorId: string | undefined) {
    this.instructorService.getInstructor(instructorId).subscribe({
      next: (response) => {
        this.instructorInfo = response;
      },
      error: (error) => {
        console.error('Error retrieved instructor:', error);
      },
      complete: () => {
        console.log('instructor retrieved completed.');
      },
    });
  }

  deleteVideo() {
    const scrollPosition = window.pageYOffset;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Borrar el video',
        message: 'Estas seguro de borrar el video?',
        confirmText: 'Borrar',
        cancelText: 'Volver',
        onConfirm: () => {
          this.bunnystreamService.deleteVideo( 'workshop' ,this.videoId).subscribe(
            (response) => {
              this.workshopService.deleteWorkshop(this.videoId).subscribe({
                next: (response) => {
                  this.deleteVideoInInstructor();
                },
                error: (error) => {
                  console.error('Error deleted Workshopr:', error);
                },
                complete: () => {
                  console.log('Workshop deleted completed.');
                },
              });
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

  deleteVideoInInstructor() {
    const updatedVideos = this.instructorInfo.videos?.filter(
      (video: { videoId: string }) => video.videoId !== this.videoId
    );

    const updatedInstructor: Instructor = {
      ...this.instructorInfo,
      videos: updatedVideos,
    };

    this.instructorService.updateInstructor(updatedInstructor).subscribe({
      next: (response) => {
        console.log('instructor updated successfully');
      },
      error: (error) => {
        console.error('Error updated instructor:', error);
      },
      complete: () => {
        console.log('instructor updated completed.');
      },
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
          this.bunnystreamService.deleteVideo('workshop', this.videoId).subscribe(
            (response) => {
              this.workshopService.deleteWorkshop(this.videoId).subscribe({
                next: (response) => {
                  console.log('Workshop deleted successfully');
                },
                error: (error) => {
                  console.error('Error deleted Workshopr:', error);
                },
                complete: () => {
                  console.log('Cration deleted completed.');
                },
              });
            },
            (error) => {
              console.error('Error retrieving videos:', error);
            }
          );
        },
      } as DialogData,
    });
  }

  goBack() {
    this.location.back();
  }

  onSubscribe() {
    this.router.navigate(['suscribe']);
  }
}
