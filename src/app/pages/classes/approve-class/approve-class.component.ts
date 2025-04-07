import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ClassesService } from '../../../shared/services/classes.service';
import { Classes } from '../../../shared/Models/Classes';
import { Instructor } from '../../../shared/Models/Instructor';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { InstructorService } from '../../../shared/services/instructor.service';

@Component({
  selector: 'app-approve-class',
  templateUrl: './approve-class.component.html',
  styleUrl: './approve-class.component.css',
})
export class ApproveClassComponent {
  activeVideoId!: any;
  linkVideo!: SafeResourceUrl;
  classInfo!: Classes;
  instructors!: Instructor[];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private classesService: ClassesService,
    private bunnystreamService: BunnystreamService,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeVideoId = params.get('id');
    });
    this.getVideo();
  }

  getVideo() {
    this.getSingleClass(this.activeVideoId);
    const link = `https://iframe.mediadelivery.net/embed/263508/${this.activeVideoId.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`;
    this.linkVideo = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  getSingleClass(classId: string) {
    this.classesService.getClass(classId).subscribe({
      next: (response) => {
        this.classInfo = response;
        console.log('class retrieved', response);
      },
      error: (error) => {
        console.log('Error retrieving class', error);
      },
    });
  }

  // updateVideoStatus(status: string, reason?: string) {
  //   const selectedInstructor = this.instructors.find(
  //     (instructor: { videos: { videoId: string }[] }) =>
  //       instructor.videos?.some(
  //         (video: { videoId: string }) => video.videoId === this.activeVideoId
  //       )
  //   );

  //   if (!selectedInstructor) {
  //     console.error('Instructor not found for this video.');
  //     return;
  //   }

  //   const updatedVideos = selectedInstructor.videos.map(
  //     (video: { videoId: string }) =>
  //       video.videoId === this.activeVideoId ? { ...video, status } : video
  //   );

  //   const updatedClass: Classes = {
  //     ...this.classInfo,
  //     status: status,
  //   };

  //   console.log(updatedClass);

  //   const updatedInstructor: Instructor = {
  //     ...selectedInstructor,
  //     videos: updatedVideos,
  //   };

  //   this.instructorService.updateInstructor(updatedInstructor).subscribe(
  //     (response: any) => {
  //       console.log(`Instructor video status updated to ${status}`, response);
  //       this.classesService.updateClass(updatedClass).subscribe({
  //         next: (response) => {
  //           console.log('class updated from classes document', response);
  //         },
  //         error: (error) => {
  //           console.log('Error updated classes from document', error);
  //         },
  //       });
  //       if (status === 'underObservation') {
  //         this.sendObservationEmail(
  //           selectedInstructor.email,
  //           'reason',
  //           this.activeVideoId
  //         );
  //       }
  //       if (status === 'reject') {
  //         this.bunnystreamService.deleteVideo(this.activeVideoId).subscribe(
  //           (response) => {
  //             console.log('Success deleting video:', response);
  //             this.classesService.deleteClass(this.activeVideoId).subscribe({
  //               next: (response) => {
  //                 console.log('class removed from classes document', response);
  //               },
  //               error: (error) => {
  //                 console.log('Error removing classes from document', error);
  //               },
  //             });
  //           },
  //           (error) => {
  //             console.error('Error retrieving videos:', error);
  //           }
  //         );
  //       }
  //     },
  //     (error) => {
  //       console.error('Error updating instructor:', error);
  //     }
  //   );
  // }

  // rejectVideo() {
  //   const selectedInstructor = this.instructors.find(
  //     (instructor: { videos: { videoId: string }[] }) =>
  //       instructor.videos?.some(
  //         (video: { videoId: string }) => video.videoId === this.activeVideoId
  //       )
  //   );
  //   if (!selectedInstructor) {
  //     console.error('Instructor not found for this video.');
  //     return;
  //   }

  //   const updatedVideos = selectedInstructor.videos?.filter(
  //     (video: { videoId: string }) => video.videoId !== this.activeVideoId
  //   );

  //   const updatedInstructor: Instructor = {
  //     ...selectedInstructor,
  //     videos: updatedVideos,
  //   };

  //   this.bunnystreamService.deleteVideo(this.activeVideoId).subscribe(
  //     (response) => {
  //       console.log('Success deleting video:', response);
  //       this.instructorService.updateInstructor(updatedInstructor).subscribe(
  //         (response: any) => {
  //           console.log('Instructor updated successfully', response);
  //         },
  //         (error) => {
  //           console.error('Error updating instructor:', error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error retrieving videos:', error);
  //     }
  //   );
  // }

  goBack() {
    this.location.back();
  }
}
