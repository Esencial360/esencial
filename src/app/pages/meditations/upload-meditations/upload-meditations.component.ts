import { Component } from '@angular/core';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { InstructorService } from '../../../shared/services/instructor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassesService } from '../../../shared/services/classes.service';
import { Instructor } from '../../../shared/Models/Instructor';
import { Meditation } from '../../../shared/Models/Meditation';
import { MeditationService } from '../../../shared/services/meditation.service';
import { take } from 'rxjs';

interface UploadVideo {
  title: string;
  collectionId: string;
}

@Component({
  selector: 'app-upload-meditations',
  templateUrl: './upload-meditations.component.html',
  styleUrl: './upload-meditations.component.css',
})
export class UploadMeditationsComponent {
  videoData!: UploadVideo;
  collectionList: any[] = [];
  newMeditationForm!: FormGroup;
  selectedFile!: File;
  isModalOpen = false;
  firstStep: boolean = true;
  secondStep: boolean = false;
  thirdStep: boolean = false;
  videoId!: string;
  instructors!: Instructor[];
  selectedInstructor!: string;
  loading!: boolean;
  error!: string;
  uploadingProgress!: string;

  constructor(
    private bunnyStreamService: BunnystreamService,
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router,
    private meditationService: MeditationService
  ) {
    this.newMeditationForm = this.fb.group({
      title: ['', Validators.required],
      instructorId: [''],
      meditationClass: [null, Validators.required],
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

  createVideo() {}

  onSubmit() {
    if (this.newMeditationForm.valid) {
      this.uploadVideoAndCreateStep();
    }
  }

  uploadVideoAndCreateStep() {
    this.firstStep = false;
    this.secondStep = true;
  }

  onSubmitNewInstructor() {
    this.loading = true;
    this.firstStep = false;
    this.secondStep = true;

    if (this.newMeditationForm.valid && this.selectedFile) {
      let instructorId;
      if (!this.newMeditationForm.value.instructorId) {
        instructorId = '';
      } else {
        instructorId = this.newMeditationForm.value.instructorId;
      }
      const formData = new FormData();
      formData.append('title', this.newMeditationForm.value.title);
      formData.append('instructorId', instructorId);
      formData.append('meditationClass', this.selectedFile);
      console.log(formData);

      this.meditationService.createMeditation(formData).subscribe({
        next: (response) => {
          console.log('meditation created:');
          this.loading = false;
        },
        error: (error) => {
          console.log('Error Creating meditation', error);
          this.error = error;
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

  onProcessDone() {
    this.router.navigate(['/home']);
  }
}
