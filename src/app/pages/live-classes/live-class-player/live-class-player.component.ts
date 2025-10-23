import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, interval, takeUntil } from 'rxjs';
import { LiveClassService, LiveClass } from '../../../shared/services/live-class.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-live-class-player',
  templateUrl: './live-class-player.component.html',
  styleUrls: ['./live-class-player.component.css']
})
export class LiveClassPlayerComponent implements OnInit, OnDestroy {
  liveClass: LiveClass | null = null;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  loading = true;
  error: string | null = null;
  isRegistered = false;
  currentUserId: string = ''; // Obtener del servicio de autenticación
  
  youtubeStatus: any = null;
  viewers = 0;

  private destroy$ = new Subject<void>();
  private classId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private liveClassService: LiveClassService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.classId = this.route.snapshot.paramMap.get('id') || '';
    if (this.classId) {
      this.loadClass();
      this.startStatusPolling();
    } else {
      this.router.navigate(['/live-classes']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClass(): void {
    this.loading = true;
    this.error = null;

    this.liveClassService.getClassById(this.classId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.liveClass = response.data;
            this.setupYouTubeEmbed();
            this.checkRegistration();
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

  setupYouTubeEmbed(): void {
    if (this.liveClass) {
      const embedUrl = this.liveClassService.getYouTubeEmbedUrl(
        this.liveClass.youtubeVideoId,
        true
      );
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  checkRegistration(): void {
    if (this.liveClass && this.currentUserId) {
      // this.isRegistered = this.liveClass.registeredUsers.includes(this.currentUserId);
    }
  }

  startStatusPolling(): void {
    // Actualizar estado de YouTube cada 20 segundos
    interval(20000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateYouTubeStatus();
      });

    // Primera actualización inmediata
    this.updateYouTubeStatus();
  }

  updateYouTubeStatus(): void {
    // this.liveClassService.getYouTubeStatus(this.classId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       if (response.success && response.data) {
    //         this.youtubeStatus = response.data;
    //         this.viewers = response.data.viewers || 0;
            
    //         // Actualizar el estado local si cambió
    //         if (this.liveClass && this.liveClass.status !== response.data.status) {
    //           this.liveClass.status = response.data.status;
    //         }
    //       }
    //     },
    //     error: (err) => {
    //       console.error('Error al actualizar estado de YouTube:', err);
    //     }
    //   });
  }

  registerToClass(): void {
    if (!this.currentUserId) {
      // Redirigir a login o mostrar mensaje
      alert('Debes iniciar sesión para registrarte');
      return;
    }

    if (this.liveClass) {
      this.liveClassService.registerToClass(this.liveClass._id, this.currentUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.isRegistered = true;
              alert('¡Registrado exitosamente!');
              if (response.data) {
                this.liveClass = response.data;
              }
            }
          },
          error: (err) => {
            console.error('Error al registrarse:', err);
            alert(err.error?.message || 'Error al registrarse a la clase');
          }
        });
    }
  }

  unregisterFromClass(): void {
    if (this.liveClass && this.currentUserId) {
      // Implementar endpoint de desregistro si es necesario
      console.log('Desregistrar de la clase');
    }
  }

  goBack() {
    this.location.back();
  }

  shareClass(): void {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: this.liveClass?.title || 'Clase de Yoga en Vivo',
        text: this.liveClass?.description || '',
        url: url
      }).catch(err => console.error('Error al compartir:', err));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(url).then(() => {
        alert('Enlace copiado al portapapeles');
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(): string {
    switch (this.liveClass?.status) {
      case 'live':
        return 'bg-red-600';
      case 'scheduled':
        return 'bg-blue-600';
      case 'ended':
        return 'bg-gray-600';
      default:
        return 'bg-gray-400';
    }
  }

  getStatusText(): string {
    switch (this.liveClass?.status) {
      case 'live':
        return 'EN VIVO';
      case 'scheduled':
        return 'PROGRAMADA';
      case 'ended':
        return 'FINALIZADA';
      case 'cancelled':
        return 'CANCELADA';
      default:
        return '';
    }
  }
}