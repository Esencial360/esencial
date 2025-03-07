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
  description: string;
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
      {
        title: 'Experiencia',
        image: '../../../assets/images/logoBlue.png',
        description:
          'Nosotros valoramos tu trayectoria. Como parte de esencial360, te pedimos generar 5 contenidos al mes, asistir a reuniones de alineación y recibir asesoría. Nosotras te proporcionamos los lineamientos necesarios para facilitar la producción de tu contenido.',
      },
      {
        title: 'Intercambio',
        image: '../../../assets/images/logoBlue.png',
        description: 'Tu impacto es clave. Apreciamos las referencias de tus alumnos o conocidos, y como intercambio, recibirás el 25% de la mensualidad de cada recomendado que se inscriba.',
      },
      {
        title: 'Crecimiento',
        image: '../../../assets/images/logoBlue.png',
        description:
          'Te brindamos una plataforma para conectar con más alumnos, visibilidad para tu marca y el respaldo de una comunidad sólida que valora tu conocimiento.',
      },
    ];
  }

  onHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    console.log('onsubmit');
  }

  onContinueToForm() {
    this.formView = true;
  }

  onDialogClosed() {
    this.formView = false;
  }

  scrollArrow() {
    const element = document.getElementById('scrollContent')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    } 
  }
}
