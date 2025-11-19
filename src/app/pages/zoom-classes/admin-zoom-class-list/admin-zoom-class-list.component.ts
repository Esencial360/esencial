import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ZoomClassService,
  ZoomClass,
} from '../../../shared/services/zoom-class.service';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-admin-zoom-class-list',
  templateUrl: './admin-zoom-class-list.component.html',
  styleUrls: ['./admin-zoom-class-list.component.css'],
})
export class AdminZoomClassListComponent implements OnInit, OnDestroy {
  zoomClasses: ZoomClass[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Filters
  statusFilter: string = 'all';
  currentPage = 1;
  totalPages = 1;
  limit = 10;

  isLoading!: boolean;
  user: any;
  userId: any;
  roles!: string;

  forbidden!: boolean;
    // Dropdown state
  openDropdownId: string | null = null;

  private destroy$ = new Subject<void>();
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private zoomClassService: ZoomClassService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      this.authService.user$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user) => {
          if (user) {
            this.isLoading = false;
            this.user = user;
            const namespace = 'https://test-assign-roles.com/';
            this.roles = user[`${namespace}roles`][0] || [];
            console.log(this.roles);
            
          } else {
            this.isLoading = false;
            this.user = undefined;
          }
        });
    }
    this.loadZoomClasses();

    // Refresh every minute to update live status
    setInterval(() => {
      this.loadZoomClasses();
    }, 60000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    /**
   * Toggle dropdown open/close
   */
  toggleDropdown(classId: string): void {
    event?.stopPropagation(); // Prevent document click from immediately closing
    this.openDropdownId = this.openDropdownId === classId ? null : classId;
  }

  /**
   * Update status and close dropdown
   */
  updateStatusAndClose(classId: string, newStatus: string): void {
    this.updateStatus(classId, newStatus);
    this.openDropdownId = null;
  }

  loadZoomClasses(): void {
    this.loading = true;
    this.errorMessage = '';

    const filters: any = {
      limit: this.limit,
      page: this.currentPage,
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
        this.forbidden = true;
      },
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
            setTimeout(() => (this.successMessage = ''), 3000);
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la clase';
          console.error('Error deleting class:', error);
        },
      });
    }
  }

  /**
   * Update class status
   */
  // updateStatus(classId: string, newStatus: string): void {
  //   this.zoomClassService.updateClassStatus(classId, newStatus).subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.successMessage = 'Estado actualizado exitosamente';
  //         this.loadZoomClasses();
  //         setTimeout(() => (this.successMessage = ''), 3000);
  //       }
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Error al actualizar el estado';
  //       console.error('Error updating status:', error);
  //       setTimeout(() => (this.errorMessage = ''), 3000);
  //     },
  //   });
  // }

  /**
   * Check if class is currently live
   */
  isClassLive(scheduledDate: Date | string, duration: number): boolean {
    return this.zoomClassService.isClassLive(scheduledDate, duration);
  }

  /**
   * Get status badge styling
   */
  // getStatusBadgeClass(status: string): string {
  //   const classes = {
  //     scheduled: 'bg-blue/10 text-blue border-blue/20',
  //     live: 'bg-green-100 text-green-700 border-green-200',
  //     completed: 'bg-gray-100 text-gray-600 border-gray-200',
  //     cancelled: 'bg-red/10 text-red border-red/20',
  //   };
  //   return (
  //     classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-600'
  //   );
  // }

  /**
   * Get status text in Spanish
   */
  // getStatusText(status: string): string {
  //   const texts = {
  //     scheduled: 'Programada',
  //     live: 'En Vivo',
  //     completed: 'Completada',
  //     cancelled: 'Cancelada',
  //   };
  //   return texts[status as keyof typeof texts] || status;
  // }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    const classDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return classDate.toLocaleDateString('es-ES', options);
  }

  /**
   * Get time until class (or how long ago it was)
   */
  getTimeUntil(date: Date | string): string {
    const now = new Date();
    const classTime = new Date(date);
    const diff = classTime.getTime() - now.getTime();

    if (diff < 0) {
      // Class is in the past
      const daysPast = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
      const hoursPast = Math.floor(Math.abs(diff) / (1000 * 60 * 60));

      if (daysPast > 0) return `Hace ${daysPast}d`;
      if (hoursPast > 0) return `Hace ${hoursPast}h`;
      return 'Hace poco';
    }

    // Class is in the future
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `En ${days}d ${hours}h`;
    if (hours > 0) return `En ${hours}h ${minutes}min`;
    return `En ${minutes}min`;
  }

  /**
   * Copy zoom link to clipboard
   */
  copyZoomLink(zoomLink: string): void {
    navigator.clipboard.writeText(zoomLink).then(() => {
      this.successMessage = 'Link copiado al portapapeles';
      setTimeout(() => (this.successMessage = ''), 2000);
    });
  }

  /**
   * Get available status options based on current status
   */
  // getAvailableStatuses(
  //   currentStatus: string
  // ): Array<{ value: string; label: string }> {
  //   const allStatuses = [
  //     { value: 'scheduled', label: 'Programada' },
  //     { value: 'live', label: 'En Vivo' },
  //     { value: 'completed', label: 'Completada' },
  //     { value: 'cancelled', label: 'Cancelada' },
  //   ];

  //   // Filter out current status
  //   return allStatuses.filter((s) => s.value !== currentStatus);
  // }

  onSubscribe() {
    this.router.navigate(['suscribe']);
  }

  // Add this property
hoveredClassId: string | null = null;

// Add this method for mouse leave with slight delay
private leaveTimeout: any;

onMouseLeave(): void {
  this.leaveTimeout = setTimeout(() => {
    this.hoveredClassId = null;
  }, 150); // Small delay to allow mouse to move to dropdown
}

// Update the mouse enter to clear any pending leave
onMouseEnter(classId: string): void {
  if (this.leaveTimeout) {
    clearTimeout(this.leaveTimeout);
  }
  this.hoveredClassId = classId;
}

/**
 * Get hover class for status options
 */
getStatusHoverClass(status: string): string {
  const classes = {
    'scheduled': 'text-gray-700 hover:bg-blue/10 hover:text-blue',
    'live': 'text-gray-700 hover:bg-green-50 hover:text-green-700',
    'completed': 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
    'cancelled': 'text-gray-700 hover:bg-red/10 hover:text-red'
  };
  return classes[status as keyof typeof classes] || 'text-gray-700 hover:bg-gray-100';
}

/**
 * Get icon background class for status options
 */
getStatusIconBgClass(status: string): string {
  const classes = {
    'scheduled': 'bg-blue',
    'live': 'bg-green-500',
    'completed': 'bg-gray-400',
    'cancelled': 'bg-red'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-400';
}

  /**
 * Get status badge styling
 */
getStatusBadgeClass(status: string): string {
  const classes = {
    'scheduled': 'bg-blue/10 text-blue border-blue/20',
    'live': 'bg-green-100 text-green-700 border-green-200',
    'completed': 'bg-gray-100 text-gray-600 border-gray-200',
    'cancelled': 'bg-red/10 text-red border-red/20'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-600 border-gray-200';
}

/**
 * Get status text in Spanish
 */
getStatusText(status: string): string {
  const texts = {
    'scheduled': 'Programada',
    'live': 'En Vivo',
    'completed': 'Completada',
    'cancelled': 'Cancelada'
  };
  return texts[status as keyof typeof texts] || status;
}

/**
 * Get available status options based on current status
 */
getAvailableStatuses(currentStatus: string): Array<{value: string, label: string}> {
  const allStatuses = [
    { value: 'scheduled', label: 'Programada' },
    { value: 'live', label: 'En Vivo' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];
  
  // Filter out current status
  return allStatuses.filter(s => s.value !== currentStatus);
}

/**
 * Update class status
 */
updateStatus(classId: string, newStatus: string): void {
  this.zoomClassService.updateClassStatus(classId, newStatus as any).subscribe({
    next: (response) => {
      if (response.success) {
        this.successMessage = 'Estado actualizado exitosamente';
        this.loadZoomClasses();
        setTimeout(() => (this.successMessage = ''), 3000);
      }
    },
    error: (error) => {
      this.errorMessage = 'Error al actualizar el estado';
      console.error('Error updating status:', error);
      setTimeout(() => (this.errorMessage = ''), 3000);
    },
  });
}
}
