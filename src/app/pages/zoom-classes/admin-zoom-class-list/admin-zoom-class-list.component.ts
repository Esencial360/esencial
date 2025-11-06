import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ZoomClassService, ZoomClass } from '../../../shared/services/zoom-class.service';
@Component({
  selector: 'app-admin-zoom-class-list',
  templateUrl: './admin-zoom-class-list.component.html',
  styleUrls: ['./admin-zoom-class-list.component.css']
})
export class AdminZoomClassListComponent implements OnInit {
  zoomClasses: ZoomClass[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Filters
  statusFilter: string = 'all';
  currentPage = 1;
  totalPages = 1;
  limit = 10;

  constructor(
    private zoomClassService: ZoomClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadZoomClasses();
  }

  loadZoomClasses(): void {
    this.loading = true;
    this.errorMessage = '';

    const filters: any = {
      limit: this.limit,
      page: this.currentPage
    };

    if (this.statusFilter !== 'all') {
      filters.status = this.statusFilter;
    }

    this.zoomClassService.getZoomClasses(filters).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.zoomClasses = response.data;
          this.totalPages = response.totalPages || 1;
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

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadZoomClasses();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadZoomClasses();
    }
  }

  createNewClass(): void {
    this.router.navigate(['/admin/clases-zoom/nueva']);
  }

  editClass(classId: string): void {
    this.router.navigate(['/admin/clases-zoom/editar', classId]);
  }

  deleteClass(classId: string, title: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la clase "${title}"?`)) {
      this.zoomClassService.deleteZoomClass(classId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Clase eliminada exitosamente';
            this.loadZoomClasses();
            setTimeout(() => this.successMessage = '', 3000);
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la clase';
          console.error('Error deleting class:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'scheduled': 'bg-blue/10 text-blue border-blue/20',
      'live': 'bg-green-100 text-green-700 border-green-200',
      'completed': 'bg-gray-100 text-gray-600 border-gray-200',
      'cancelled': 'bg-red/10 text-red border-red/20'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-600';
  }

  getStatusText(status: string): string {
    const texts = {
      'scheduled': 'Programada',
      'live': 'En Vivo',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return texts[status as keyof typeof texts] || status;
  }

  formatDate(date: Date | string): string {
    return this.zoomClassService.formatClassDate(date);
  }

  getTimeUntil(date: Date | string): string {
    return this.zoomClassService.getTimeUntilClass(date);
  }

  isClassLive(scheduledDate: Date | string, duration: number): boolean {
    return this.zoomClassService.isClassLive(scheduledDate, duration);
  }

  copyZoomLink(zoomLink: string): void {
    navigator.clipboard.writeText(zoomLink).then(() => {
      this.successMessage = 'Link copiado al portapapeles';
      setTimeout(() => this.successMessage = '', 2000);
    });
  }
}