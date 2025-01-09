import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrl: './dialog-form.component.css',
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})
export class DialogFormComponent implements OnInit {
  consultationForm!: FormGroup;
  instructorForm!: FormGroup;
  resumeFile: File | null = null;
  resumeError: string = '';
  videoError: string = '';
  formSubmitted!: boolean;
  submitted = false;
  success = false;
  error = '';
  formView = false;
  videoFile: any;
  onSubmittingForm!: boolean;
  formSuccess!: boolean;
  introForm!: boolean;
  @Input()
  isOpen!: boolean;

  @Input()
  newVideo!: boolean;

  @Input()
  newBlog!: boolean;

  @Input()
  contactForm!: boolean;
  

  @Output()
  onCloseDialog = new EventEmitter<boolean>();

  @Output()
  onSubmitForm = new EventEmitter<boolean>();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private emailService: EmailService,
  ) {
    window.scroll(0, 0)
    this.instructorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      years: [0, [Validators.required, Validators.min(0)]],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  // ngOnChanges(simpleChanges: SimpleChanges) {
  //   this.isOpen[]
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.resumeFile = file;
        this.resumeError = '';
      } else {
        this.resumeFile = null;
        this.resumeError = 'Invalid file type. Please upload a PDF file.';
      }
    }
  }

  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(file);

    if (file) {
      if (this.isVideoFile(file)) {
        this.videoFile = file;
        this.videoError = '';
      } else {
        this.videoFile = null;
        this.videoError = 'Invalid file type. Please upload a PDF file.';
      }
    }
  }

  isVideoFile(file: File): boolean {
    console.log(file);

    const videoTypes = [
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/quicktime',
    ];
    return videoTypes.includes(file.type);
  }

  onSubmit() {
    if (this.instructorForm.valid && this.resumeFile) {
      const formData = new FormData();
      this.formSubmitted = true;
      this.onSubmittingForm = true;
      // Append form fields
      Object.keys(this.instructorForm.value).forEach((key) => {
        formData.append(key, this.instructorForm.value[key]);
      });

      // Append the resume file
      formData.append('resume', this.resumeFile, this.resumeFile.name);

      formData.append('video', this.videoFile, this.videoFile.name);

      // Send the new instructor data
      this.emailService.sendNewInstructor(formData).subscribe({
        next: (response) => {
          console.log('Form sent successfully', response);
          this.success = true;
          // Store the current scroll position
          const scrollPosition = window.pageYOffset;

          // Prevent scrolling
          // document.body.style.top = `-${scrollPosition}px`;
          // document.body.style.position = 'fixed';
          // document.body.style.width = '100%';
          document.body.classList.remove('overflow-hidden');

          // Send the confirmation email

           const htmlContentPath = '/assets/views/potentialInstructor.html';
          const emailData = {
            to: this.instructorForm.value.email,
            subject: 'Muchas gracias por contactarnos.',
            text: `Gracias por contactarnos. Hemos recibido su mensaje.`,
            html: `Gracias por contactarnos. Hemos recibido su mensaje.`,
          };

          this.emailService.sendEmail(emailData).subscribe({
            next: (emailResponse) => {
              console.log(
                'Confirmation email sent successfully',
                emailResponse
              );
            },
            error: (emailError) => {
              console.error('Error sending confirmation email', emailError);
            },
          });

          this.instructorForm.reset();
          this.resumeFile = null;
          this.submitted = false;
          this.formView = false;
          this.onSubmittingForm = false;
          this.formSuccess = true;
        },
        error: (error) => {
          console.error('Error sending form', error);
          this.error = error.message;
        },
      });
    } else {
      this.error = 'Please fill all required fields and select a resume file.';
    }
  }

  onProcessDone() {
    this.formSuccess = false;
    this.closeDialog()
    this.router.navigate(['/'])
    document.body.classList.remove('overflow-hidden');

  }

  closeDialog() {
    document.body.classList.remove('overflow-hidden');
    this.isOpen = false;
    this.onCloseDialog.emit(true);

  }
}
