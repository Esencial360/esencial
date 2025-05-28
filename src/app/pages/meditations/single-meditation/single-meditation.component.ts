import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Meditation } from '../../../shared/Models/Meditation';
import { Instructor } from '../../../shared/Models/Instructor';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { MeditationService } from '../../../shared/services/meditation.service';
import { InstructorService } from '../../../shared/services/instructor.service';
import { selectActiveUser } from '../../../state/user.selectors';
import { Subject, takeUntil } from 'rxjs';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-meditation',
  templateUrl: './single-meditation.component.html',
  styleUrl: './single-meditation.component.css',
})
export class SingleMeditationComponent {
  @ViewChild('dialogAnchor') dialogAnchor!: ElementRef;
  @ViewChild('bunnyVideo') videoIframe!: ElementRef;
  meditationId!: any;
  pullZone = environment.pullZone;
  videos!: any;
  link!: SafeResourceUrl;
  isLoading!: boolean;
  roles!: string;
  isLiked = false;
  userId!: string;
  meditationInfo!: Meditation;
  instructorInfo!: Instructor;
  forbidden!: boolean;
  users$!: any;
  user$!: any;
  user!: any;
  class = {
    title: 'FLUYE CONSCIENTE CON LULÚ FRAGA',
    duration: '30 MIN',
    level: 'I/A',
    description:
      'En esta meditación guiada aprenderás a observar sin juicio, a respirar con presencia y a soltar la tensión acumulada. Ideal para comenzar el día en calma o cerrar con gratitud.',
    items: [
      {
        icon: this.pullZone + '/assets/yogaMat.png',
        text: 'Espacio cómodo y limpio',
      },
      {
        icon: this.pullZone + '/assets/waterBottle.png',
        text: 'Vaso de agua al alcance',
      },
      {
        icon: this.pullZone + '/assets/towel.png',
        text: 'Manta ligera o cojín',
      },
    ],
    recommendations: [
      {
        icon: this.pullZone + '/assets/wakingUp.png',
        text: 'Practica al despertar o antes de dormir',
      },
      {
        icon: this.pullZone + '/assets/bowl.png',
        text: 'Opcional: usa cuencos o sonidos suaves',
      },
      {
        icon: this.pullZone + '/assets/sun.png',
        text: 'Medita cerca de luz natural si es posible',
      },
      {
        icon: this.pullZone + '/assets/boxes.png',
        text: 'Apoya la espalda si lo necesitas',
      },
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
    private meditationService: MeditationService,
    private instructorService: InstructorService
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
      this.meditationId = params.get('id');
    });
    this.getVideoInfo();

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.authService.user$.subscribe((user) => {
        if (user) {
          const namespace = 'https://test-assign-roles.com/';
          this.roles = user[`${namespace}roles`][0] || [];
          this.isLoading = false;
        }
      });
    });
  }

  getVideoInfo() {
    this.meditationService.getMeditation(this.meditationId).subscribe({
      next: (response) => {
        this.meditationInfo = response;
        this.getInstructor(response.instructorId);
      },
      error: (error) => {
        console.error('Error retrieved Meditation:', error);
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
        title: 'Borrar el meditacion',
        message: 'Estas seguro de borrar la meditacion?',
        confirmText: 'Borrar',
        cancelText: 'Volver',
        onConfirm: () => {
          this.meditationService.deleteMeditation(this.meditationId).subscribe({
            next: (response) => {
              console.log('Meditation deleted');
            },
            error: (error) => {
              console.error('Error deleted Meditation:', error);
            },
            complete: () => {
              console.log('Meditation deleted completed.');
            },
          });
          this.showSuccessMessage();
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
      } as DialogData,
    });
  }

  goBack() {
    this.location.back();
  }

   onSubscribe() {
    this.router.navigate(['subscribe'])
  }
}
