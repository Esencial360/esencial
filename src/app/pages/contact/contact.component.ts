import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../shared/services/email.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;
  error = '';
  pullZone = environment.pullZone

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      this;
      const emailData = {
        to: this.contactForm.value.email,
        subject: 'Muchas gracias por contactarnos. ',
        text: `Dear ${this.contactForm.value.email},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nYour Company`,
        html: '<p>This is a <strong>test</strong> email.</p>',
      };
      this.emailService.sendEmail(emailData).subscribe({
        next: (response) => {
          this.success = true;
          this.contactForm.reset();
          this.submitted = false;
        },
        error: (error) => {
          this.error = error.message;
        },
      });
      this.emailService.sendContactForm(this.contactForm.value).subscribe(
        (response) => {
          console.log('form send successfully');
        },
        (error) => {
          console.error('error sending form', error);
        }
      );
    }
  }
}
