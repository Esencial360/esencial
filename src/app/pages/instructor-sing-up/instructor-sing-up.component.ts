import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../shared/services/email.service';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../shared/dialog/dialog.component';

@Component({
  selector: 'app-instructor-sing-up',
  templateUrl: './instructor-sing-up.component.html',
  styleUrl: './instructor-sing-up.component.css',
})
export class InstructorSingUpComponent implements OnInit {
  instructorForm: FormGroup;
  resumeFile: File | null = null;
  resumeError: string = '';
  videoError: string = '';
  formSubmitted!: boolean;
  submitted = false;
  success = false;
  error = '';
  formView = false;
  videoFile: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService,
    private dialog: MatDialog
  ) {
    this.instructorForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      years: [0, [Validators.required, Validators.min(0)]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.formSubmitted = false;
  }

  onHome() {
    this.router.navigate(['/']);
  }

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
      'video/quicktime'
    ];
    return videoTypes.includes(file.type);
  }

  onSubmit() {
    if (this.instructorForm.valid && this.resumeFile) {
      const formData = new FormData();
      this.formSubmitted = true;

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
          this.showSuccessMessage()
          // Store the current scroll position
          const scrollPosition = window.pageYOffset;

          // Prevent scrolling
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';

          // Send the confirmation email
          const emailData = {
            to: this.instructorForm.value.email,
            subject: 'Muchas gracias por contactarnos.',
            text: `Nuevo potencial instructor ${JSON.stringify(
              this.instructorForm.value
            )}`,
            html: `Nuevo potencial instructor ${JSON.stringify(
              this.instructorForm.value
            )}`,
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

          // Reset the form and file input after successful submission
          this.instructorForm.reset();
          this.resumeFile = null;
          this.submitted = false;
          this.formView = false;
        },
        error: (error) => {
          console.error('Error sending form', error);
          this.error = error.message;
        },
      });
    } else {
      // Form is invalid or no resume file selected
      this.error = 'Please fill all required fields and select a resume file.';
    }
  }

  showSuccessMessage() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Tu solicitud ha sido mandada exitosamente',
        message: 'Da click para regresar a la pagina principal',
        confirmText: 'Aceptar',
        onConfirm: () => {
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigateByUrl('/');
            document.body.style.position = 'relative';
          });
        },
      } as DialogData,
    });
  }

  showErrorMessage() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Intenta de nuevo',
        message: 'Video no ha podido ser eliminado',
        confirmText: 'Nuevo intento',
        onConfirm: () => {
          this.router
            .navigateByUrl('/carrera-instructor')
            .then((navigationSuccess) => {
              if (navigationSuccess) {
                console.log('Navigation to instructores page successful');
              } else {
                console.error('Navigation to instructores page failed');
              }
            })
            .catch((error) => {
              console.error(
                `An error occurred during navigation: ${error.message}`
              );
            });
        },
      } as DialogData,
    });
  }

  onContinueToForm() {
    window.scrollTo(0,0)
    this.formView = true;
  }
}
