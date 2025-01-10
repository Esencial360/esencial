import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../shared/services/email.service';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../../shared/ui/dialog/dialog.component';

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
      { title: 'YOGA', image: '../../../assets/images/8.png ', description: ''},
      { title: 'Meditación', image: '../../../assets/images/4.png' },
      { title: 'disciplinas varias, relativas al desarrollo personal y evolución del ser', image: '../../../assets/images/10.png ' },
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
