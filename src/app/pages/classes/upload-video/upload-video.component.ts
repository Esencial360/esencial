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
import { ClassesService } from '../../../shared/services/classes.service';
import { Classes } from '../../../shared/Models/Classes';

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
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css',
})
export class UploadVideoComponent implements OnInit {
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
  uploadingProgress!: string

  constructor(
    private bunnyStreamService: BunnystreamService,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    private classesService: ClassesService
  ) {
    this.newVideoForm = this.fb.group({
      title: ['', Validators.required],
      collectionId: ['', Validators.required],
      instructor: [''],
      difficulty: ['', Validators.required],
      subcategory: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getCollectionList();
    this.instructorService.getAllInstructors().subscribe(
      (response) => {
        this.instructors = response;
        console.log('Instructs successfully', response);
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

  getCollectionList() {
    this.bunnyStreamService.getCollectionList().subscribe(
      (response: any) => {
        this.collectionList = response.items;
        console.log(this.collectionList);
      },
      (error) => {
        console.error('Error retrieving collection:', error);
      }
    );
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
    console.log(selectedInstructor);
    
    if (selectedInstructor) {
      const instructorVideos = selectedInstructor.videos
        ? selectedInstructor.videos
        : [];

      const newVideo = {
        videoId: videoId,
        status: 'Pending',
      };
      const updatedInstructor: Instructor = {
        ...selectedInstructor,
        videos: [...instructorVideos, newVideo],
      };

      const videos = videoId ? [videoId] : [];
      const instructorData: Instructor = { ...updatedInstructor };
      const classVideo: Classes = {
        classId: videoId,
        instructorId: selectedInstructor._id,
        difficulty: this.newVideoForm.value.difficulty,
        subcategory: this.newVideoForm.value.subcategory,
      };
      this.classesService.createClass(classVideo).subscribe({
        next: (response) => {
          console.log('Class created successfully', response);
        },
        error: (error) => {
          console.error('Error creating Classr:', error);
        },
        complete: () => {
          console.log('Cration process completed.');
        },
      });
      this.instructorService.updateInstructor(instructorData).subscribe({
        next: (response) => {
          console.log('Instructor updated successfully', response);
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
      const classVideo: Classes = {
        classId: videoId,
        instructorId: '',
        difficulty: this.newVideoForm.value.difficulty,
        subcategory: this.newVideoForm.value.subcategory,

      };
      this.classesService.createClass(classVideo).subscribe({
        next: (response) => {
          console.log('Class created successfully', response);
        },
        error: (error) => {
          console.error('Error creating Classr:', error);
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
    console.log(this.selectedFile);
  }

  createVideo() {
    const { title, collectionId } =
      this.newVideoForm.value;

    this.bunnyStreamService
      .createVideo(title, collectionId, 5000)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          console.log('Video created successfully:', response);
          this.videoId = response.guid;
          this.onUploadVideo();
        },
        (error) => {
          console.error('Error creating video:', error);
        }
      );
  }

  async onUploadVideo() {
    const { title, collectionId, } =
      this.newVideoForm.value;
    if (!this.selectedFile || !this.videoId) return;

    this.loading = true;

    await this.bunnyStreamService.uploadVideoWithTus(
      this.selectedFile,
      this.videoId,
      title,
      collectionId,
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
        this.uploadingProgress = progress.toFixed(2)
      }
    );
  }


  onProcessDone() {
    this.router.navigate(['/home']);
  }

  getSubcategories(): string[] {
    const collection = this.newVideoForm.get('collectionId')?.value;
    if (collection === '0ea815c8-7cf9-42e7-a5b0-4e0f6eef0d15')
      return ['Restaurativo', 'Iyengar', 'Yin'];
    if (collection === '472608a1-1a1c-4828-9bdc-12c590ecc759')
      return ['Power', 'Flow', 'Ashtanga'];
    return [];
  }
}
