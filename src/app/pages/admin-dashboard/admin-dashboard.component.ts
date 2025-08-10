import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { Store } from '@ngrx/store';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  filters = [
    'EDITA TU PERFIL',
    'CAMBIA TU CONTRASEÑA',
    'INSTRUCTORES',
    'VIDEOS PENDIENTES',
    'PLAN SEMANAL',
    'CATEGORIAS'
  ];
  isLoading!: boolean;
  pullZone: string = environment.pullZone;

  constructor(
    private userService: UserService,
    private store: Store,
    public authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  onNewMeditation() {
    this.router.navigate(['/nueva-meditacion']);
  }

  onNewClass() {
    this.router.navigateByUrl('/nuevo-video');
  }

    onNewWorkshop() {
    this.router.navigateByUrl('/nuevo-taller');
  }
}
