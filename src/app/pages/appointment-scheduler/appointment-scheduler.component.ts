import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Appointment } from '../../shared/Models/Appointment';

@Component({
  selector: 'app-appointment-scheduler',
  templateUrl: './appointment-scheduler.component.html',
  styleUrl: './appointment-scheduler.component.css'
})
export class AppointmentSchedulerComponent {

  appointmentForm: FormGroup;
  minDate: string;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.appointmentForm.controls;
  }

  // onSubmit() {
  //   this.submitted = true;

  //   if (this.appointmentForm.valid) {
  //     console.log('Form submitted:', this.appointmentForm.value);
  //     // Add your appointment scheduling logic here
      
  //     // Reset form after successful submission
  //     this.appointmentForm.reset();
  //     this.submitted = false;
  //   }
  // }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.appointmentForm.valid) {
      this.loading = true;

      const appointmentData: Appointment = {
        name: this.f['name'].value,
        email: this.f['email'].value,
        date: this.f['date'].value,
        time: this.f['time'].value,
        notes: this.f['notes'].value
      };

      this.appointmentService.createAppointment(appointmentData)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            
            this.successMessage = 'Appointment scheduled successfully!';
            this.appointmentForm.reset();
            this.submitted = false;
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
    }
  }

}
