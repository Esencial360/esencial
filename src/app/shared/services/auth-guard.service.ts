import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      // Token is present, allow access
      console.log('accessToken')
      return true;
    } else {
      // Token is not present, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
