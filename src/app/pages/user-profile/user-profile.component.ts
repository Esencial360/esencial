import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { Instructor } from '../../shared/Models/Instructor';
import { isPlatformBrowser } from '@angular/common';

interface PreviewInstructor {
  _id: number;
  name: string;
  description: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  profileJson!: string;
  filters: string[] = ['EDITA TU PERFIL'];
  activeFilter: string = this.filters[0];
  dropdownClosed: boolean = true;
  passwordForm!: FormGroup;
  message: string = '';
  instructors: any;
  user: any;
  userId: any;
  instructor!: Instructor;
  videos!: any[];
  pendingVideos: string[] = [];
  isLoading!: boolean;
  roles!: string;
  showModal!: boolean;
  linkVideo!: SafeResourceUrl;
  resultReviewAction!: string;
  showModalAfterAction!: boolean;
  activeVideoId!: string;
  observationReason!: string;
  filteredInstructors: PreviewInstructor[] | undefined;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    if (isPlatformBrowser(this.platformId)) {
      this.authService.user$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((user) => {
          if (user) {
            this.isLoading = false;
            this.user = user;
          }
          this.authService.user$.subscribe((user) => {
            if (user) {
              const namespace = 'https://test-assign-roles.com';
              this.roles = user[`${namespace}roles`][0] || [];
              this.setFilters();
            }
          });
        });
    }
    const accessToken = await this.authService.getAccessTokenSilently({
      authorizationParams: {
        scope: 'update:current_user_metadata',
      },
    });
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleDropdown() {
    this.dropdownClosed = !this.dropdownClosed;
  }

  setFilters() {
    if (this.roles === 'Admin') {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'INSTRUCTORES',
        'VIDEOS PENDIENTES',
      ];
    } else if (this.roles === 'Instructor') {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'MIS CLASES',
        'PAGOS',
        'CODIGO',
      ];
    } else {
      this.filters = [
        'EDITA TU PERFIL',
        'CAMBIA TU CONTRASEÑA',
        'MANEJA TU SUBSCRIPCION',
        'FAVORITOS',
        'BADGES',
      ];
    }
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }
}
