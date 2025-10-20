
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LiveClassService, LiveClass } from '../../../shared/services/live-class.service';

@Component({
  selector: 'app-admin-live-classes-list',
  templateUrl: './admin-live-classes-list.component.html',
  styleUrl: './admin-live-classes-list.component.css'
})
export class AdminLiveClassesListComponent {
  allClasses: LiveClass[] = [];
  filteredClasses: LiveClass[] = [];
  loading = true;
  error: string | null = null;
  
  selectedStatus: string = '';
  selectedCategory: string = '';
  searchTerm: string = '';

  statusOptions = [
    { value: '', label: 'Todos los estados', color: 'gray' },
    { value: 'scheduled', label: 'Programada', color: 'blue' },
    { value: 'live', label: 'En Vivo', color: 'red' },
    { value: 'ended', label: 'Finalizada', color: 'gray' },
    { value: 'cancelled', label: 'Cancelada', color: 'yellow' }
  ];

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

  // Modal states
  showStatusModal = false;
  showDeleteModal = false;
  selectedClass: LiveClass | null = null;
  newStatus: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private liveClassService: LiveClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClasses(): void {
    this.loading = true;
    this.error = null;

    this.liveClassService.getAllClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.allClasses = response.data;
            this.applyFilters();
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar clases:', err);
          this.error = 'Error al cargar las clases';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filteredClasses = this.allClasses.filter(cls => {
      const matchesStatus = !this.selectedStatus || cls.status === this.selectedStatus;
      const matchesCategory = !this.selectedCategory || cls.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || 
        cls.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cls.instructorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openStatusModal(liveClass: LiveClass): void {
    this.selectedClass = liveClass;
    this.newStatus = liveClass.status;
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedClass = null;
    this.newStatus = '';
  }

  confirmStatusChange(): void {
    
    if (!this.selectedClass || !this.newStatus) return;

    this.liveClassService.updateClassStatus(this.selectedClass._id, this.newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Update the class in the list
            const index = this.allClasses.findIndex(c => c._id === this.selectedClass!._id);
            if (index !== -1) {
              this.allClasses[index] = response.data;
              this.applyFilters();
            }
            this.closeStatusModal();
          }
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          alert('Error al actualizar el estado de la clase');
        }
      });
  }

  openDeleteModal(liveClass: LiveClass): void {
    this.selectedClass = liveClass;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedClass = null;
  }

  confirmDelete(): void {
    if (!this.selectedClass) return;

    this.liveClassService.deleteClass(this.selectedClass._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.allClasses = this.allClasses.filter(c => c._id !== this.selectedClass!._id);
            this.applyFilters();
            this.closeDeleteModal();
          }
        },
        error: (err) => {
          console.error('Error al eliminar clase:', err);
          alert('Error al eliminar la clase');
        }
      });
  }

  checkYouTubeStatus(liveClass: LiveClass): void {
    this.liveClassService.getYouTubeStatus(liveClass._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            alert(`Estado de YouTube:\n\nEstado: ${response.data.status}\nEn Vivo: ${response.data.isLive ? 'Sí' : 'No'}\nEspectadores: ${response.data.viewers}\nVistas Totales: ${response.data.totalViews}`);
            this.loadClasses(); // Reload to get updated data
          }
        },
        error: (err) => {
          console.error('Error al verificar YouTube:', err);
          alert('Error al verificar el estado en YouTube');
        }
      });
  }

  goToCreateClass(): void {
    this.router.navigate(['/admin/create-live-class']);
  }

  editClass(liveClass: LiveClass): void {
    this.router.navigate(['/admin/edit-live-class', liveClass._id]);
  }

  viewClass(liveClass: LiveClass): void {
    this.router.navigate(['/live-class', liveClass._id]);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getStatusColor(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getThumbnail(videoId: string): string {
    return this.liveClassService.getYouTubeThumbnail(videoId);
  }

}
