import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../shared/services/email.service';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../shared/dialog/dialog.component';

interface Service {
  title: string;
  image: string;
  description?: string;
  special?: boolean;
}

@Component({
  selector: 'app-instructor-sing-up',
  templateUrl: './instructor-sing-up.component.html',
  styleUrl: './instructor-sing-up.component.css',
})
export class InstructorSingUpComponent implements OnInit {
  instructorForm: FormGroup;
  resumeFile: any;
  resumeError: string = '';
  videoError: string = '';
  formSubmitted!: boolean;
  submitted = false;
  success = false;
  error = '';
  formView = false;
  videoFile: any;
  services: Service[] = [];
  processComplete!: boolean;
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
    this.services = [
      { title: 'YOGA', image: '../../../assets/images/yoga.jpg '},
      { title: 'FITNESS', image: '../../../assets/images/yoga.jpg' },
      { title: 'MINDFULNESS', image: '../../../assets/images/yoga.jpg' },
      { title: 'ROUTINES', image: '../../../assets/images/yoga.jpg' },
      { 
        title: 'Ready to start your journey?', 
        image: '../../../assets/images/yoga.jpg',
        special: true
      }
    ];
  }

  onHome() {
    this.router.navigate(['/']);
  }


  onContinueToForm() {
    this.formView = true;
  }

  onDialogClosed() {
    this.formView = false;
    
  }
}
