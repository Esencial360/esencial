import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../shared/services/users.service';
import { Store } from '@ngrx/store';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

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
  ];
  isLoading!: boolean;

  constructor(
    private userService: UserService,
    private store: Store,
    public authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}
}
