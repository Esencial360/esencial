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
  firstStep: boolean = true;
  secondStep: boolean = false;
  thirdStep: boolean = false;
  videoId!: string;
  instructors!: Instructor[]
  selectedInstructor!: string;

  constructor(
    private bunnyStreamService: BunnystreamService,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router
  ) {
    this.newVideoForm = this.fb.group({
      title: ['', Validators.required],
      collectionId: ['', Validators.required],
      thumbnailTime: [5000, Validators.required],
      instructor: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getCollectionList();
    this.instructorService.getAllInstructors().subscribe(
      response => {
        this.instructors = response
        console.log('Instructs successfully', response);
      },
      error => {
        console.error('Instructors error', error)
      }
    )
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
    console.log(this.newVideoForm.valid);
    
    if (this.newVideoForm.valid) {
      const formData = this.newVideoForm.value;
      this.createVideo();
      // if (this.newVideoForm.value.instructor == '') {
        
      // }
      console.log('Form submitted:', formData);
    }
  }

  // putVideoInstructor() {
  //   const videos = [this.videoId]
  //   const selectedInstructor = this.instructors.find(instructor => instructor._id === this.newVideoForm.value.instructor)
  //   const instructorData: Instructor = {...selectedInstructor, videos}
  //   this.instructorService.updateInstructor(instructorData).subscribe(
  //     (response: any) => {
  //       console.log('Instructs update successfully', response);
  //     },
  //     (error) => {
  //       console.error('Error Instructs update :', error);
  //     }
  //   )
  // }

  putVideoInstructor() {
    const selectedInstructor = this.instructors.find(instructor => instructor._id === this.newVideoForm.value.instructor);
    if (selectedInstructor) {
      const instructorVideos = selectedInstructor.videos ? selectedInstructor.videos : [];

      const newVideo = {
        videoId: this.videoId,
        status: 'Pending' // Mark as pending initially
      };
      const updatedInstructor: Instructor = {
        ...selectedInstructor,
        videos: [...instructorVideos, newVideo] 
      }; 
      
      const videos = this.videoId ? [this.videoId] : [];
      const instructorData: Instructor = { ...updatedInstructor };
  
      this.instructorService.updateInstructor(instructorData).subscribe(
        (response: any) => {
          console.log('Instructor updated successfully', response);
        },
        (error) => {
          console.error('Error updating instructor:', error);
        }
      );
    } else {
      console.error('No instructor found with the provided id');
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
    this.bunnyStreamService
      .createVideo(
        this.newVideoForm.value.title,
        this.newVideoForm.value.collectionId,
        this.newVideoForm.value.thumbnailTime
      )
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          console.log('Video uploaded successfully:', response);
          this.videoId = response.guid;
          this.putVideoInstructor()
          this.firstStep = false;
          this.secondStep = true;
        },
        (error) => {
          console.error('Error uploading video:', error);
        }
      );
  }

  onUploadVideo() {
    this.bunnyStreamService
      .uploadVideo(this.videoId, this.selectedFile)
      .pipe(take(1))
      .subscribe(
        (response) => {
          console.log('Upload video successfully', response);
          this.secondStep = false;
          this.thirdStep = true;
        },
        (error) => {
          console.error('Error uploading video:', error);
        }
      );
  }

  onProcessDone() {
    this.router.navigate(['/home'])
  }
}
