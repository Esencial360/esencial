import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(): void {
    // window.location.href = '/api/auth/login';
  }

  logout(): void {
    // window.location.href = '/api/auth/logout';
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/api/auth/user').pipe(
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  private checkAuthStatus(): void {
    this.getUserInfo().subscribe(
      () => this.isAuthenticatedSubject.next(true),
      () => this.isAuthenticatedSubject.next(false)
    );
  }
}
