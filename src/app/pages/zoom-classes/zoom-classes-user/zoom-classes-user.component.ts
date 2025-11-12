import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoomClassService, ZoomClass } from '../../../shared/services/zoom-class.service';

@Component({
  selector: 'app-zoom-classes-user',
  templateUrl: './zoom-classes-user.component.html',
  styleUrls: ['./zoom-classes-user.component.css']
})
export class ZoomClassesUserComponent implements OnInit {
  upcomingClasses: ZoomClass[] = [];
  myClasses: ZoomClass[] = [];
  loading = false;
  loadingMyClasses = false;
  errorMessage = '';
  successMessage = '';
  activeTab: 'upcoming' | 'myClasses' = 'upcoming';

  constructor(private zoomClassService: ZoomClassService) {}

  ngOnInit(): void {
    this.loadUpcomingClasses();
    this.loadMyClasses();
  }

  loadUpcomingClasses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.zoomClassService.getUpcomingClasses(20).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.upcomingClasses = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las clases';
        console.error('Error loading classes:', error);
        this.loading = false;
      }
    });
  }

  loadMyClasses(): void {
    this.loadingMyClasses = true;
    
    this.zoomClassService.getMyClasses().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.myClasses = response.data;
        }
        this.loadingMyClasses = false;
      },
      error: (error) => {
        console.error('Error loading my classes:', error);
        this.loadingMyClasses = false;
      }
    });
  }

  registerForClass(classId: string): void {
    this.zoomClassService.registerForClass(classId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = '¡Te has registrado exitosamente!';
          this.loadUpcomingClasses();
          this.loadMyClasses();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrarse';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  unregisterFromClass(classId: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar tu registro?')) {
      this.zoomClassService.unregisterFromClass(classId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Registro cancelado exitosamente';
            this.loadUpcomingClasses();
            this.loadMyClasses();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al cancelar el registro';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  joinZoomClass(zoomLink: string): void {
    window.open(zoomLink, '_blank');
  }

  isUserRegistered(zoomClass: ZoomClass): boolean {
    // This would need to check against the current user's ID
    // You'll need to implement user authentication service
    return false; // Placeholder
  }

  isClassFull(zoomClass: ZoomClass): boolean {
    return (zoomClass.registeredUsers?.length || 0) >= zoomClass.maxParticipants;
  }

  isClassLive(scheduledDate: Date | string, duration: number): boolean {
    return this.zoomClassService.isClassLive(scheduledDate, duration);
  }

  formatDate(date: Date | string): string {
    return this.zoomClassService.formatClassDate(date);
  }

  getTimeUntil(date: Date | string): string {
    return this.zoomClassService.getTimeUntilClass(date);
  }

  setActiveTab(tab: 'upcoming' | 'myClasses'): void {
    this.activeTab = tab;
  }

  getDayGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Buenos días';
    } else if (hour >= 12 && hour < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'Principiante': 'bg-green-100 text-green-700 border-green-200',
      'Intermedio': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Avanzado': 'bg-red-100 text-red-700 border-red-200',
      'Todos los niveles': 'bg-blue/10 text-blue border-blue/20'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  }
}