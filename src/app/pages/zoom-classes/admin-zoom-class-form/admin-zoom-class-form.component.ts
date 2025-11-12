import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoomClassService, ZoomClass } from '../../../shared/services/zoom-class.service';

@Component({
  selector: 'app-admin-zoom-class-form',
  templateUrl: './admin-zoom-class-form.component.html',
  styleUrls: ['./admin-zoom-class-form.component.css']
})
export class AdminZoomClassFormComponent implements OnInit {
  zoomClassForm!: FormGroup;
  isEditMode = false;
  classId: string | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  levels = ['Principiante', 'Intermedio', 'Avanzado', 'Todos los niveles'];
  categories = ['Hatha', 'Vinyasa', 'Ashtanga', 'Yin', 'Kundalini', 'Meditación', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private zoomClassService: ZoomClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId) {
      this.isEditMode = true;
      this.loadZoomClass(this.classId);
    }
  }

  initForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    this.zoomClassForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      instructorName: ['', [Validators.required]],
      zoomLink: ['', [Validators.required, Validators.pattern(/^https:\/\/(.*\.)?zoom\.us\/j\/[0-9]+(\?pwd=.*)?$/)]],
      meetingId: [''],
      password: [''],
      scheduledDate: [tomorrow.toISOString().slice(0, 16), [Validators.required]],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(180)]],
      level: ['Todos los niveles', [Validators.required]],
      category: ['Otro', [Validators.required]],
      maxParticipants: [100, [Validators.required, Validators.min(1)]]
    });
  }

  loadZoomClass(id: string): void {
    this.loading = true;
    this.zoomClassService.getZoomClassById(id).subscribe({
      next: (response) => {
        if (response.success && response.data && !Array.isArray(response.data)) {
          const zoomClass = response.data;
          const scheduledDate = new Date(zoomClass.scheduledDate);
          
          this.zoomClassForm.patchValue({
            title: zoomClass.title,
            description: zoomClass.description,
            instructorName: zoomClass.instructorName,
            zoomLink: zoomClass.zoomLink,
            meetingId: zoomClass.meetingId || '',
            password: zoomClass.password || '',
            scheduledDate: scheduledDate.toISOString().slice(0, 16),
            duration: zoomClass.duration,
            level: zoomClass.level,
            category: zoomClass.category,
            maxParticipants: zoomClass.maxParticipants
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la clase';
        console.error('Error loading class:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.zoomClassForm.invalid) {
      this.markFormGroupTouched(this.zoomClassForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.zoomClassForm.value;

    const request = this.isEditMode && this.classId
      ? this.zoomClassService.updateZoomClass(this.classId, formData)
      : this.zoomClassService.createZoomClass(formData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = this.isEditMode 
            ? 'Clase actualizada exitosamente' 
            : 'Clase creada exitosamente';
          
          setTimeout(() => {
            this.router.navigate(['/clases-zoom']);
          }, 1500);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al guardar la clase';
        console.error('Error saving class:', error);
        this.loading = false;
      }
    });
  }

  extractMeetingIdFromLink(): void {
    const zoomLink = this.zoomClassForm.get('zoomLink')?.value;
    if (zoomLink) {
      const match = zoomLink.match(/\/j\/(\d+)/);
      if (match && match[1]) {
        this.zoomClassForm.patchValue({ meetingId: match[1] });
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.zoomClassForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.zoomClassForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `Valor mínimo: ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Valor máximo: ${field.errors?.['max'].max}`;
    }
    if (field?.hasError('pattern')) {
      return 'Formato de URL de Zoom inválido';
    }
    
    return '';
  }

  cancel(): void {
    this.router.navigate(['/admin/zoom-classes']);
  }
}