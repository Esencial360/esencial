import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-appointment-scheduler',
  templateUrl: './appointment-scheduler.component.html',
  styleUrl: './appointment-scheduler.component.css'
})
export class AppointmentSchedulerComponent {

  appointmentForm: FormGroup;
  minDate: string;
  submitted = false;

  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    this.submitted = true;

    if (this.appointmentForm.valid) {
      console.log('Form submitted:', this.appointmentForm.value);
      // Add your appointment scheduling logic here
      
      // Reset form after successful submission
      this.appointmentForm.reset();
      this.submitted = false;
    }
  }

}
