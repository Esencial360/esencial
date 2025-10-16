import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LiveClassService } from '../../../shared/services/live-class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-live-class',
  templateUrl: './admin-live-class.component.html',
  styleUrl: './admin-live-class.component.css'
})
export class AdminLiveClassComponent implements OnInit {
  liveClassForm!: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showSuccessAnimation = false;
  
  // Form validation states
  formSubmitted = false;
  
  categories = [
    { value: 'hatha', label: 'Hatha', description: 'Práctica suave y lenta' },
    { value: 'vinyasa', label: 'Vinyasa', description: 'Flujo dinámico' },
    { value: 'ashtanga', label: 'Ashtanga', description: 'Serie estructurada' },
    { value: 'yin', label: 'Yin', description: 'Posturas largas y pasivas' },
    { value: 'restaurativa', label: 'Restaurativa', description: 'Relajación profunda' },
    { value: 'prenatal', label: 'Prenatal', description: 'Para embarazadas' },
    { value: 'meditacion', label: 'Meditación', description: 'Mindfulness y calma' }
  ];

  levels = [
    { value: 'principiante', label: 'Principiante', icon: '🌱' },
    { value: 'intermedio', label: 'Intermedio', icon: '🌿' },
    { value: 'avanzado', label: 'Avanzado', icon: '🌳' },
    { value: 'todos', label: 'Todos los niveles', icon: '🌈' }
  ];

  statusOptions = [
    { value: 'scheduled', label: 'Programada', color: 'blue' },
    { value: 'live', label: 'En vivo', color: 'red' },
    { value: 'ended', label: 'Finalizada', color: 'gray' }
  ];

  // Duration options in minutes
  durationOptions = [
    { value: 30, label: '30 minutos' },
    { value: 45, label: '45 minutos' },
    { value: 60, label: '1 hora' },
    { value: 75, label: '1 hora 15 min' },
    { value: 90, label: '1 hora 30 min' },
    { value: 120, label: '2 horas' }
  ];

  constructor(
    private fb: FormBuilder,
    private liveClassService: LiveClassService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // Set minimum date to current datetime
    this.setMinDateTime();
    
    // Auto-generate suggested title based on category and level
    this.setupFormListeners();
  }

  createForm(): void {
    this.liveClassForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      level: ['', Validators.required],
      instructor: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{24}$/)]],
      instructorName: ['', [Validators.required, Validators.minLength(2)]],
      youtubeVideoId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{11}$/)]],
      scheduledTime: ['', [Validators.required, this.futureDateValidator()]],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(180)]],
      maxParticipants: [30, [Validators.required, Validators.min(1), Validators.max(100)]],
      status: ['scheduled', Validators.required],
      chatEnabled: [true],
      isRecorded: [false],
      tags: [[]],
      prerequisites: [''],
      equipment: ['Mat de yoga']
    });
  }

  setupFormListeners(): void {
    // Auto-suggest title when category or level changes
    this.liveClassForm.get('category')?.valueChanges.subscribe(() => {
      this.suggestTitle();
    });
    
    this.liveClassForm.get('level')?.valueChanges.subscribe(() => {
      this.suggestTitle();
    });

    // Extract YouTube ID from URL if full URL is pasted
    this.liveClassForm.get('youtubeVideoId')?.valueChanges.subscribe((value: string) => {
      const extractedId = this.extractYoutubeId(value);
      if (extractedId && extractedId !== value) {
        this.liveClassForm.patchValue({ youtubeVideoId: extractedId }, { emitEvent: false });
      }
    });
  }

  suggestTitle(): void {
    const category = this.liveClassForm.get('category')?.value;
    const level = this.liveClassForm.get('level')?.value;
    
    if (category && level && !this.liveClassForm.get('title')?.value) {
      const categoryLabel = this.categories.find(c => c.value === category)?.label;
      const levelLabel = this.levels.find(l => l.value === level)?.label;
      
      const suggestions = [
        `${categoryLabel} ${levelLabel}`,
        `Clase de ${categoryLabel} - Nivel ${levelLabel}`,
        `${categoryLabel} Flow para ${levelLabel}s`
      ];
      
      // Set a random suggestion
      const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      this.liveClassForm.patchValue({ title: suggestion });
    }
  }

  extractYoutubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  }

  setMinDateTime(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    const minDateTime = now.toISOString().slice(0, 16);
    
    // Set min attribute programmatically
    setTimeout(() => {
      const dateInput = document.querySelector('input[type="datetime-local"]');
      if (dateInput) {
        dateInput.setAttribute('min', minDateTime);
      }
    });
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const selectedDate = new Date(control.value);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15); // At least 15 minutes in the future
      
      return selectedDate > now ? null : { pastDate: true };
    };
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;
    
    if (this.liveClassForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      this.scrollToError();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const formValue = this.prepareFormData();
      const response = await this.liveClassService.createClass(formValue).toPromise();

      if (response && response.success) {
        this.showSuccessAnimation = true;
        this.successMessage = '¡Clase creada exitosamente! 🎉';
        
        // Reset form after success
        setTimeout(() => {
          this.liveClassForm.reset({
            status: 'scheduled',
            duration: 60,
            maxParticipants: 30,
            chatEnabled: true,
            isRecorded: false,
            equipment: 'Mat de yoga'
          });
          this.formSubmitted = false;
        }, 1000);
        
        // Navigate after animation
        setTimeout(() => {
          this.router.navigate(['/admin/live-classes']);
        }, 2000);
      } else {
        this.errorMessage = response?.message || 'Error al crear la clase.';
      }
    } catch (err: any) {
      console.error('Error creating class:', err);
      this.errorMessage = err?.error?.message || 'Error inesperado. Por favor intenta de nuevo.';
    } finally {
      this.loading = false;
      setTimeout(() => {
        this.showSuccessAnimation = false;
      }, 2500);
    }
  }

  prepareFormData(): any {
    const formValue = { ...this.liveClassForm.value };
    
    // Add calculated fields
    formValue.endTime = this.calculateEndTime(formValue.scheduledTime, formValue.duration);
    
    // Process tags if they're a string
    if (typeof formValue.tags === 'string') {
      formValue.tags = formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    }
    
    return formValue;
  }

  calculateEndTime(startTime: string, duration: number): string {
    const start = new Date(startTime);
    start.setMinutes(start.getMinutes() + duration);
    return start.toISOString();
  }

  scrollToError(): void {
    const firstError = document.querySelector('.ng-invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.liveClassForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched || this.formSubmitted)) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'youtubeVideoId') return 'ID de YouTube inválido (11 caracteres)';
        if (fieldName === 'instructor') return 'ID de instructor inválido';
      }
      if (field.errors['pastDate']) return 'La fecha debe ser futura (mínimo 15 minutos)';
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.liveClassForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  resetForm(): void {
    this.liveClassForm.reset({
      status: 'scheduled',
      duration: 60,
      maxParticipants: 30,
      chatEnabled: true,
      isRecorded: false,
      equipment: 'Mat de yoga'
    });
    this.formSubmitted = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  goBack(): void {
    this.router.navigate(['/admin/live-classes']);
  }
}
