import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Instructor } from '../../../shared/Models/Instructor';
import { InstructorService } from '../../../shared/services/instructor.service';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { EmailService } from '../../../shared/services/email.service';
import { Router } from '@angular/router';
import { catchError, concatMap, from, map, of, toArray } from 'rxjs';
import { ClassesService } from '../../../shared/services/classes.service';
import { Classes } from '../../../shared/Models/Classes';
import { FormBuilder } from '@angular/forms';
import {
  DialogComponent,
  DialogData,
} from '../../../shared/ui/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface PreviewInstructor {
  _id: number;
  name: string;
  description: string;
  email: string;
}

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent implements OnInit {
  @Input() filters!: string[];

  showModal!: boolean;
  linkVideo!: SafeResourceUrl;
  resultReviewAction!: string;
  showModalAfterAction!: boolean;
  activeVideoId!: string;
  observationReason!: string;
  instructors: any;
  videos!: any[];
  filteredInstructors: PreviewInstructor[] | undefined;
  pendingVideos: string[] = [];
  isLoading!: boolean;
  classInfo!: any;
  emailData!: any;
  activeVideoInfo!: any;
  instructorInfo!: Instructor;
  activeClassInfo!: Classes;

  constructor(
    private sanitizer: DomSanitizer,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private emailService: EmailService,
    private router: Router,
    private classesService: ClassesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllInstructors();
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

  onInstructor(id: number) {
    this.router.navigate([`/instructor-previa/${id}`]);
  }

  async getAllInstructors() {
    await this.refreshInstructors();
  }

  async refreshInstructors() {
    this.instructorService.getAllInstructors().subscribe((instructors) => {
      this.instructors = instructors;
      this.filteredInstructors = this.instructors;
      this.pendingVideos = [];
      instructors.forEach((instructor) => {
        (instructor.videos ?? [])
          .filter((video) => video.status === 'Pending')
          .forEach((video) => {
            this.pendingVideos.push(video.videoId);
          });
      });

      this.getVideo(this.pendingVideos);
    });
  }
  getVideo(videos: any) {
    if (videos.length === 0) {
      return;
    }

    from(videos)
      .pipe(
        concatMap((videoId) =>
          this.bunnystreamService.getVideo('video', videoId).pipe(
            map((video) => ({
              video: video,
              safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${
                  video.thumbnailFileName || 'thumbnail.jpg'
                }`
              ),
            })),
            catchError((error) => {
              console.warn(`Failed to load video ${videoId}:`, error);
              return of(null);
            })
          )
        ),
        toArray(),
        map((videos) => videos.filter((v) => v !== null))
      )
      .subscribe({
        next: (videos) => {
          this.videos = videos;
        },
        error: (error) => {
          console.error('Unexpected error retrieving videos:', error);
        },
      });
  }

  onApprovalVideo(video: any) {
    this.isLoading = true;
    this.showModal = true;
    this.activeVideoId = video.guid;
    this.activeVideoInfo = video;
    this.getSingleClass(this.activeVideoId);
    const link = `https://iframe.mediadelivery.net/embed/263508/${this.activeVideoId}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
    this.linkVideo = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    this.isLoading = false;
  }

  handleAction(action: string) {
    this.showModal = false;
    if (action === 'reject') {
      this.rejectVideoConfirmation();
    } else {
      this.approveVideoConfirmation();
    }
  }

  approveVideoConfirmation() {
    const scrollPosition = window.pageYOffset;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Aprovar video',
        message: 'Estas seguro de aprovar el video?',
        confirmText: 'Aprovar',
        cancelText: 'Volver',
      } as DialogData,
    });

    dialogRef.afterOpened().subscribe(() => {
      window.scrollTo(0, scrollPosition);
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resultReviewAction = 'approve';
        this.showModalAfterAction = true;
        this.updateVideoStatus(this.resultReviewAction);
      } else if (!result) {
        this.showModal = true;
      }
    });
  }

  rejectVideoConfirmation() {
    const scrollPosition = window.pageYOffset;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Rechazar video',
        message: 'Estas seguro de rechazar el video?',
        confirmText: 'Rechazar',
        cancelText: 'Volver',
      } as DialogData,
    });

    dialogRef.afterOpened().subscribe(() => {
      window.scrollTo(0, scrollPosition);
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resultReviewAction = 'reject';
        this.showModalAfterAction = true;
        this.rejectVideo();
        this.updateVideoStatus(this.resultReviewAction);
      } else if (!result) {
        this.showModal = true;
      }
    });
  }

  getSingleClass(classId: string) {
    this.classesService.getClass(classId).subscribe({
      next: (response) => {
        this.classInfo = response;
        this.getClassInstructor(this.classInfo.instructorId);
      },
      error: (error) => {
        console.log('Error retrieving class', error);
      },
    });
  }

  updateVideoStatus(status: string, reason?: string) {
    const selectedInstructor = this.instructors.find(
      (instructor: { videos: { videoId: string }[] }) =>
        instructor.videos?.some(
          (video: { videoId: string }) => video.videoId === this.activeVideoId
        )
    );

    if (!selectedInstructor) {
      console.error('Instructor not found for this video.');
      return;
    }

    const updatedVideos = selectedInstructor.videos.map(
      (video: { videoId: string }) =>
        video.videoId === this.activeVideoId ? { ...video, status } : video
    );

    const updatedClass: Classes = {
      ...this.classInfo,
      status: status,
    };
    const updatedInstructor: Instructor = {
      ...selectedInstructor,
      videos: updatedVideos,
    };

    this.instructorService.updateInstructor(updatedInstructor).subscribe(
      (response: any) => {
        this.classesService.updateClass(updatedClass).subscribe({
          next: (response) => {
            this.sendObservationEmail(
              selectedInstructor,
              'Su clase se ha aprovado.',
              this.activeVideoId,
              true
            );
          },
          error: (error) => {
            console.log('Error updated classes from document', error);
          },
        });
      },
      (error) => {
        console.error('Error updating instructor:', error);
      }
    );
  }

  rejectVideo() {
    const selectedInstructor = this.instructors.find(
      (instructor: { videos: { videoId: string }[] }) =>
        instructor.videos?.some(
          (video: { videoId: string }) => video.videoId === this.activeVideoId
        )
    );
    if (!selectedInstructor) {
      console.error('Instructor not found for this video.');
      return;
    }

    const updatedVideos = selectedInstructor.videos?.filter(
      (video: { videoId: string }) => video.videoId !== this.activeVideoId
    );

    const updatedInstructor: Instructor = {
      ...selectedInstructor,
      videos: updatedVideos,
    };

    this.bunnystreamService.deleteVideo('video', this.activeVideoId).subscribe(
      (response) => {
        this.instructorService.updateInstructor(updatedInstructor).subscribe(
          (response: any) => {
            this.deleteClass();
            this.sendObservationEmail(
              selectedInstructor,
              'La clase no alzanzo los requisitos necesarios para ser aprovada. Por favor revise la guia y vuelva a subir la clase una vez que alcanze todos los requisitos solicitados.',
              this.activeVideoId,
              false
            );
          },
          (error) => {
            console.error('Error updating instructor:', error);
          }
        );
      },
      (error) => {
        console.error('Error retrieving videos:', error);
      }
    );
  }

  deleteClass() {
    this.classesService.deleteClass(this.activeVideoId).subscribe({
      next: (response) => {
        console.log('class removed from classes document');
      },
      error: (error) => {
        console.log('Error removing classes from document', error);
      },
    });
  }

  onProcessDone() {
    this.showModal = false;
    this.showModalAfterAction = false;
    location.reload();
  }

  sendObservationEmail(
    instructor: any,
    reason: string,
    videoId: string,
    approve: boolean
  ) {
    if (!approve) {
      this.emailData = {
        to: instructor.email,
        subject: 'Tu clase ha sido rechazada',
        html: `
          <p>Estiamdo ${instructor.firstname},</p>
          <p>Su clase (<strong>${this.activeVideoInfo.title}</strong>) ha sido <strong>rechazada</strong>.</p>
          <p>Reason: <em>${reason}</em></p>
          <p>Comuníquese con nosotros si tiene alguna pregunta.</p>
          <p>Saludos cordiales,<br>el consejo de esencial360</p>
        `,
      };
    } else {
      this.emailData = {
        to: instructor.email,
        subject: 'Tu clase ha sido aprovada',
        html: `
          <p>Estiamdo ${instructor.firstname},</p>
          <p>Su clase (<strong>${this.activeVideoInfo.title}</strong>) ha sido <strong>aprovada</strong>.</p>
          <p>Reason: <em>${reason}</em></p>
          <p>Su clase ya esta disponible para verse para la comunidad de esencial360</p>
          <p>Saludos cordiales,<br>el consejo de esencial360</p>
        `,
      };
    }

    this.emailService.sendEmail(this.emailData).subscribe(
      () => {
        console.log('Observation email sent successfully');
      },
      (error: any) => {
        console.error('Error sending observation email:', error);
      }
    );
  }

  getClassInstructor(id: string) {
    this.instructorService.getInstructor(id).subscribe({
      next: (response) => {
        this.instructorInfo = response;
      },
      error: (error) => {
        console.log('An error retrieving Instructor info', error);
      },
    });
  }

  getClassInfo(id: string) {
    this.classesService.getClass(id).subscribe({
      next: (response) => {
        this.activeClassInfo = response;
      },
      error: (error) => {
        console.log('An error retrieving Class info', error);
      },
    });
  }
}
