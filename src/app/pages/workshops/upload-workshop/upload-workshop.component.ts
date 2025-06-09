import { Component, OnInit } from '@angular/core';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { take } from 'rxjs';
import { InstructorService } from '../../../shared/services/instructor.service';
import { Instructor } from '../../../shared/Models/Instructor';
import { Router } from '@angular/router';
import { WorkshopService } from '../../../shared/services/workshop.service';
import { Workshop } from '../../../shared/Models/Workshop';

interface UploadVideo {
  title: string;
  collectionId: string;
}

interface VideoResponse {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
}

@Component({
  selector: 'app-upload-workshop',
  templateUrl: './upload-workshop.component.html',
  styleUrl: './upload-workshop.component.css',
})
export class UploadWorkshopComponent {
  videoData!: UploadVideo;
  collectionList: any[] = [];
  newVideoForm!: FormGroup;
  selectedFile!: File;
  isModalOpen = false;
  firstStep: boolean = true;
  secondStep: boolean = false;
  thirdStep: boolean = false;
  videoId!: string;
  instructors!: Instructor[];
  selectedInstructor!: string;
  loading!: boolean;
  uploadingProgress!: string;
  libraryId = 452333

  constructor(
    private bunnyStreamService: BunnystreamService,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    private workshopService: WorkshopService
  ) {
    this.newVideoForm = this.fb.group({
      title: ['', Validators.required],
      instructor: [''],
      // subcategory: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.instructorService.getAllInstructors().subscribe(
      (response) => {
        this.instructors = response;
        console.log('Instructs successfully');
      },
      (error) => {
        console.error('Instructors error', error);
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.newVideoForm.valid) {
      this.uploadVideoAndCreateStep();
    }
  }

  uploadVideoAndCreateStep() {
    this.firstStep = false;
    this.secondStep = true;
  }

  putVideoInstructor(videoId: string) {
    const selectedInstructor = this.instructors.find(
      (instructor) => instructor._id === this.newVideoForm.value.instructor
    );
    if (selectedInstructor) {
      const instructorWorkshops = selectedInstructor.workshops
        ? selectedInstructor.workshops
        : [];

      const newVideo = {
        videoId: videoId,
        status: 'approve',
      };
      const updatedInstructor: Instructor = {
        ...selectedInstructor,
        workshops: [...instructorWorkshops, newVideo],
      };

      const videos = videoId ? [videoId] : [];
      const instructorData: Instructor = { ...updatedInstructor };

      const workshopVideo: Workshop = {
        workshopId: videoId,
        instructorId: selectedInstructor._id,
        subcategory: this.newVideoForm.value.subcategory,
      };
      this.workshopService.createWorkshop(workshopVideo).subscribe({
        next: (response) => {
          console.log('Workshop created successfully');
        },
        error: (error) => {
          console.error('Error creating Workshopr:', error);
        },
        complete: () => {
          console.log('Cration process completed.');
        },
      });
      this.instructorService.updateInstructor(instructorData).subscribe({
        next: (response) => {
          console.log('Instructor updated successfully');
        },
        error: (error) => {
          console.error('Error updating instructor:', error);
        },
        complete: () => {
          console.log('Update process completed.');
        },
      });
    } else {
      console.error('No instructor found with the provided id');
      const workshopVideo: Workshop = {
        workshopId: videoId,
        instructorId: '',
        subcategory: this.newVideoForm.value.subcategory,
      };
      this.workshopService.createWorkshop(workshopVideo).subscribe({
        next: (response) => {
          console.log('Workshop created successfully');
        },
        error: (error) => {
          console.error('Error creating Workshopr:', error);
        },
        complete: () => {
          console.log('Cration process completed.');
        },
      });
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  createVideo() {
    const { title } = this.newVideoForm.value;

    this.bunnyStreamService
      .createWorkshop(title)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          console.log('Video created successfully:');
          this.videoId = response.guid;
          this.onUploadVideo();
        },
        (error) => {
          console.error('Error creating video:', error);
        }
      );
  }

  async onUploadVideo() {
    const { title } = this.newVideoForm.value;
    if (!this.selectedFile || !this.videoId) return;

    this.loading = true;

    await this.bunnyStreamService.uploadVideoWithTusWorkshop(
      this.selectedFile,
      this.videoId,
      title,
      () => {
        console.log('Upload video successfully');
        this.secondStep = false;
        this.loading = false;
        this.thirdStep = true;
        this.putVideoInstructor(this.videoId);
      },
      (error) => {
        console.error('Error uploading video:', error);
        this.loading = false;
      },
      (progress) => {
        console.log(`Uploading: ${progress.toFixed(2)}%`);
        this.uploadingProgress = progress.toFixed(2);
      }
    );
  }

  onProcessDone() {
    this.router.navigate(['/home']);
  }

}
