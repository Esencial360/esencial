import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveClassService, LiveClass } from '../../../shared/services/live-class.service';

@Component({
  selector: 'app-edit-live-classes',
  templateUrl: './edit-live-classes.component.html',
  styleUrl: './edit-live-classes.component.css'
})
export class EditLiveClassesComponent implements OnInit {
  liveClassForm!: FormGroup;
  loading = true;
  saving = false;
  error: string | null = null;
  success = false;
  classId: string = '';
  originalClass: LiveClass | null = null;

  categories = [
    { value: 'hatha', label: 'Hatha' },
    { value: 'vinyasa', label: 'Vinyasa' },
    { value: 'ashtanga', label: 'Ashtanga' },
    { value: 'yin', label: 'Yin' },
    { value: 'restaurativa', label: 'Restaurativa' },
    { value: 'prenatal', label: 'Prenatal' },
    { value: 'meditacion', label: 'Meditación' }
  ];

  levels = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'todos', label: 'Todos los niveles' }
  ];

  statusOptions = [
    { value: 'scheduled', label: 'Programada' },
    { value: 'live', label: 'En Vivo' },
    { value: 'ended', label: 'Finalizada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private liveClassService: LiveClassService
  ) {}

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.classId) {
      this.router.navigate(['/admin/live-classes']);
      return;
    }
    
    this.initForm();
    this.loadClass();
  }

  initForm(): void {
    this.liveClassForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      instructorName: ['', Validators.required],
      instructor: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(180)]],
      youtubeVideoId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{11}$/)]],
      youtubeChannelId: ['', Validators.required],
      category: ['vinyasa', Validators.required],
      level: ['todos', Validators.required],
      maxParticipants: [100, [Validators.required, Validators.min(1)]],
      status: ['scheduled', Validators.required],
      chatEnabled: [true],
      isRecorded: [true]
    });
  }

  loadClass(): void {
    this.loading = true;
    this.error = null;

    this.liveClassService.getClassById(this.classId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.originalClass = response.data;
          this.populateForm(response.data);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar la clase:', err);
        this.error = 'No se pudo cargar la clase';
        this.loading = false;
      }
    });
  }

  populateForm(liveClass: LiveClass): void {
    const scheduledTime = new Date(liveClass.scheduledTime);
    const formattedTime = scheduledTime.toISOString().slice(0, 16);

    this.liveClassForm.patchValue({
      title: liveClass.title,
      description: liveClass.description,
      instructorName: liveClass.instructorName,
      instructor: liveClass.instructor._id || liveClass.instructor,
      scheduledTime: formattedTime,
      duration: liveClass.duration,
      youtubeVideoId: liveClass.youtubeVideoId,
      youtubeChannelId: liveClass.youtubeChannelId,
      category: liveClass.category,
      level: liveClass.level,
      maxParticipants: liveClass.maxParticipants,
      status: liveClass.status,
      chatEnabled: liveClass.chatEnabled,
      isRecorded: liveClass.isRecorded
    });
  }

  onSubmit(): void {
    if (this.liveClassForm.invalid) {
      this.markFormGroupTouched(this.liveClassForm);
      this.error = 'Por favor completa todos los campos requeridos correctamente';
      return;
    }

    this.saving = true;
    this.error = null;

    const formData = {
      ...this.liveClassForm.value,
      scheduledTime: new Date(this.liveClassForm.value.scheduledTime).toISOString()
    };

    this.liveClassService.updateClass(this.classId, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/admin/live-classes']);
          }, 1500);
        }
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Error al actualizar la clase';
        console.error('Error:', err);
      },
      complete: () => {
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/live-classes']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.liveClassForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `El valor mínimo es ${min}`;
    }
    if (control?.hasError('max')) {
      const max = control.errors?.['max'].max;
      return `El valor máximo es ${max}`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido. Debe ser un ID de video de YouTube válido (11 caracteres)';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.liveClassForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  hasChanges(): boolean {
    if (!this.originalClass) return false;
    return JSON.stringify(this.liveClassForm.value) !== JSON.stringify(this.getOriginalFormValue());
  }

  private getOriginalFormValue(): any {
    if (!this.originalClass) return {};
    
    const scheduledTime = new Date(this.originalClass.scheduledTime);
    const formattedTime = scheduledTime.toISOString().slice(0, 16);

    return {
      title: this.originalClass.title,
      description: this.originalClass.description,
      instructorName: this.originalClass.instructorName,
      instructor: typeof this.originalClass.instructor === 'object' 
        ? this.originalClass.instructor._id 
        : this.originalClass.instructor,
      scheduledTime: formattedTime,
      duration: this.originalClass.duration,
      youtubeVideoId: this.originalClass.youtubeVideoId,
      youtubeChannelId: this.originalClass.youtubeChannelId,
      category: this.originalClass.category,
      level: this.originalClass.level,
      maxParticipants: this.originalClass.maxParticipants,
      status: this.originalClass.status,
      chatEnabled: this.originalClass.chatEnabled,
      isRecorded: this.originalClass.isRecorded
    };
  }

}
