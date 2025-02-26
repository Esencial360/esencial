import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Instructor } from '../../../shared/Models/Instructor';
import { InstructorService } from '../../../shared/services/instructor.service';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { EmailService } from '../../../shared/services/email.service';
import { Router } from '@angular/router';
import { concatMap, from, map, toArray } from 'rxjs';

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

  constructor(
    private sanitizer: DomSanitizer,
    private instructorService: InstructorService,
    private bunnystreamService: BunnystreamService,
    private emailService: EmailService,
    private router: Router
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
      console.log(instructors);
      
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

  async getVideo(videoIds: any) {
    if (videoIds.length === 0) {
    } else if (videoIds.length === 1) {
      from(videoIds)
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
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    } else if (videoIds.length > 1) {
      from(videoIds)
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
          },
          error: (error) => {
            console.error('Error retrieving videos:', error);
          },
        });
    }
    this.isLoading = false;
  }

  onApprovalVideo(video: any) {
    this.showModal = true;
    this.activeVideoId = video.guid;
    const link = `https://iframe.mediadelivery.net/embed/263508/${video.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
    this.linkVideo = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  handleAction(action: string) {
    this.showModal = false;
    this.resultReviewAction = action;
    this.showModalAfterAction = true;
    if (action === 'reject') {
      this.rejectVideo();
    } else {
      this.updateVideoStatus(action);
    }
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

    const updatedInstructor: Instructor = {
      ...selectedInstructor,
      videos: updatedVideos,
    };

    this.instructorService.updateInstructor(updatedInstructor).subscribe(
      (response: any) => {
        console.log(`Instructor video status updated to ${status}`, response);
        if (status === 'underObservation') {
          this.sendObservationEmail(
            selectedInstructor.email,
            'reason',
            this.activeVideoId
          );
        }

        if (status === 'reject') {
          this.bunnystreamService.deleteVideo(this.activeVideoId).subscribe(
            (response) => {
              console.log('Success deleting video:', response);
            },
            (error) => {
              console.error('Error retrieving videos:', error);
            }
          );
        }
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

    this.bunnystreamService.deleteVideo(this.activeVideoId).subscribe(
      (response) => {
        console.log('Success deleting video:', response);
        this.instructorService.updateInstructor(updatedInstructor).subscribe(
          (response: any) => {
            console.log('Instructor updated successfully', response);
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

  onProcessDone() {
    this.showModal = false;
    this.showModalAfterAction = false;
  }

  sendObservationEmail(toEmail: string, reason: string, videoId: string) {
    console.log(toEmail);

    const emailData = {
      to: toEmail,
      subject: 'Your video is under observation',
      html: `
        <p>Dear Instructor,</p>
        <p>Your video (ID: <strong>${videoId}</strong>) has been marked as <strong>Under Observation</strong>.</p>
        <p>Reason: <em>${reason}</em></p>
        <p>Please reach out if you have any questions.</p>
        <p>Best regards,<br>ESENCIAL360 Team</p>
      `,
    };

    this.emailService.sendEmail(emailData).subscribe(
      () => {
        console.log('Observation email sent successfully');
      },
      (error: any) => {
        console.error('Error sending observation email:', error);
      }
    );
  }
}
