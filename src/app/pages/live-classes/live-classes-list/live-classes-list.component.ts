import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LiveClassService, LiveClass } from '../../../shared/services/live-class.service';

@Component({
  selector: 'app-live-classes-list',
  templateUrl: './live-classes-list.component.html',
  styleUrls: ['./live-classes-list.component.css']
})
export class LiveClassesListComponent implements OnInit, OnDestroy {
  liveClasses: LiveClass[] = [];
  upcomingClasses: LiveClass[] = [];
  loading = true;
  error: string | null = null;
  
  selectedCategory: string = '';
  selectedLevel: string = '';
  
  categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'hatha', label: 'Hatha' },
    { value: 'vinyasa', label: 'Vinyasa' },
    { value: 'ashtanga', label: 'Ashtanga' },
    { value: 'yin', label: 'Yin' },
    { value: 'restaurativa', label: 'Restaurativa' },
    { value: 'prenatal', label: 'Prenatal' },
    { value: 'meditacion', label: 'Meditación' }
  ];

  levels = [
    { value: '', label: 'Todos los niveles' },
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
    { value: 'todos', label: 'Todos los niveles' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private liveClassService: LiveClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClasses(): void {
    this.loading = true;
    this.error = null;

    // Cargar clases en vivo
    this.liveClassService.getLiveClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.liveClasses = response.data;
          }
        },
        error: (err: any) => {
          console.error('Error al cargar clases en vivo:', err);
          this.error = 'Error al cargar las clases en vivo';
        }
      });

    // Cargar clases próximas
    const filters: any = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.selectedLevel) filters.level = this.selectedLevel;

    this.liveClassService.getUpcomingClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.upcomingClasses = response.data;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar clases próximas:', err);
          this.error = 'Error al cargar las clases próximas';
          this.loading = false;
        }
      });
  }

  startPolling(): void {
    // Actualizar clases en vivo cada 30 segundos
    this.liveClassService.getLiveClassesWithPolling(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.liveClasses = response.data;
          }
        },
        error: (err) => {
          console.error('Error en polling:', err);
        }
      });
  }

  onFilterChange(): void {
    this.loadClasses();
  }

  goToClass(classId: string): void {
    this.router.navigate(['/clase-envivo', classId]);
  }

  getThumbnail(videoId: string): string {
    return this.liveClassService.getYouTubeThumbnail(videoId);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return `Hoy ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return `Mañana ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  getTimeRemaining(scheduledTime: Date): string {
    const ms = this.liveClassService.getTimeUntilStart(scheduledTime);
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `En ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Comienza pronto';
  }
}