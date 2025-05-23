import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { InstructorService } from '../../services/instructor.service';
import { Instructor } from '../../Models/Instructor';

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
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'scale(0.9)' })
        ),
      ]),
    ]),
  ],
})
export class DialogFormComponent implements OnInit {
  consultationForm!: FormGroup;
  instructorForm!: FormGroup;
  newInstructorForm!: FormGroup;
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
  selectedFileNewInstructor!: File | null;
  @Input()
  isOpen!: boolean;

  @Input()
  newVideo!: boolean;

  @Input()
  newBlog!: boolean;

  @Input()
  title: string = '';

  @Input()
  contactForm!: boolean;

  @Output()
  onCloseDialog = new EventEmitter<boolean>();

  @Output()
  onSubmitForm = new EventEmitter<boolean>();

  @Output()
  close = new EventEmitter<void>();

  @Input()
  newInstructorFromAdmin!: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private emailService: EmailService,
    private instructorService: InstructorService
  ) {
    window.scroll(0, 0);
    this.instructorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      years: [0, [Validators.required, Validators.min(0)]],
      message: ['', Validators.required],
    });

    this.newInstructorForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: [null],
    });
  }

  ngOnInit() {}

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
    if (file) {
      if (this.isVideoFile(file) && file.size < 25 * 1024 * 1024) {
        this.videoFile = file;
        this.videoError = '';
        console.log('Is video File true');
      } else if (file.size > 25 * 1024 * 1024) {
        this.videoError = 'Video demasiado grande. Máximo 25 MB permitidos';
        this.videoFile = null;
      } else {
        this.videoFile = null;
        this.videoError =
          'Tipo de archivo no válido. Por favor, cargue un archivo de vídeo válido.';
      }
    }
  }

  isVideoFile(file: File): boolean {
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
    if (this.instructorForm.valid && this.resumeFile && this.videoFile) {
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
            subject:
              'Gracias por tu interés en convertirte en instructor en Esencial360',
            text: `Hola,

Gracias por contactarnos y por tu interés en formar parte de Esencial360 como instructor/a.

Hemos recibido tu solicitud y comenzaremos a evaluar tus credenciales y experiencia. Nos pondremos en contacto contigo lo antes posible para informarte sobre los siguientes pasos.

Si tienes alguna pregunta mientras tanto, no dudes en escribirnos.

¡Gracias de nuevo!

El equipo de Esencial360`,
            html: `
    <p>Hola,</p>
    <p>Gracias por contactarnos y por tu interés en formar parte de <strong>Esencial360</strong> como instructor/a.</p>
    <p>Hemos recibido tu solicitud y comenzaremos a evaluar tus credenciales y experiencia. Nos pondremos en contacto contigo lo antes posible para informarte sobre los siguientes pasos.</p>
    <p>Si tienes alguna pregunta mientras tanto, no dudes en escribirnos.</p>
    <p>¡Gracias de nuevo!</p>
    <p><strong>El equipo de Esencial360</strong></p>
  `,
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

  onFileSelectedNewInstructor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFileNewInstructor = target.files[0];
    }
  }

  onSubmitNewInstructor() {
    if (this.newInstructorForm.valid && this.selectedFileNewInstructor) {
      const formData = new FormData();

      formData.append('firstname', this.newInstructorForm.value.firstname);
      formData.append('lastname', this.newInstructorForm.value.lastname);
      formData.append('title', this.newInstructorForm.value.title);
      formData.append('email', this.newInstructorForm.value.email);
      formData.append('description', this.newInstructorForm.value.description);
      formData.append('profilePicture', this.selectedFileNewInstructor);
      this.instructorService.createInstructor(formData).subscribe({
        next: (response) => {
          console.log('Instructor created:', response);
          this.onSubmittingForm = true;
          const emailData = {
            to: this.newInstructorForm.value.email,
            subject: 'Hemos confirmado tu admision como instructor.',
            text: `Ya puede acceder a la plataforma como instructor con sus crendenciales.`,
            html: `Estamos emocionados de colaborar juntos. El equipo de esencial360`,
          };

          this.emailService.sendEmail(emailData).subscribe({
            next: (emailResponse) => {
              console.log(
                'Confirmation email sent successfully',
                emailResponse
              );
              this.newInstructorForm.reset();
              this.selectedFileNewInstructor = null;
              this.formView = false;
              this.onSubmittingForm = false;
              this.formSuccess = true;
            },
            error: (emailError) => {
              console.error('Error sending confirmation email', emailError);
            },
          });
        },
        error: (error) => {
          console.log('Error Creating Instructor', error);
          this.error = error;
        },
      });
    }
  }

  onProcessDone() {
    this.formSuccess = false;
    this.closeDialog();
    this.router.navigate(['/']);
    document.body.classList.remove('overflow-hidden');
  }

  closeDialog() {
    this.selectedFileNewInstructor = null;
    this.formView = false;
    this.resumeFile = null;
    this.formSuccess = false;
    document.body.classList.remove('overflow-hidden');
    this.isOpen = false;
    this.onCloseDialog.emit(true);
  }

  closeModal() {
    this.close.emit();
  }
}
