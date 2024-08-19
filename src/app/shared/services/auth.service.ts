// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000'; // Replace with your API URL

//   constructor(private http: HttpClient, private router: Router) { }

//   login(username: string, password: string): Observable<any> {
//     const credentials = { email: username, pwd: password };
//     return this.http.post(`${this.apiUrl}/auth`, credentials, { withCredentials: true, observe: 'response' });
//   }

//   logout(): Observable<any> {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('roles');
//     this.router.navigate(['/']);
//     return this.http.get(`${this.apiUrl}/logout`,  { withCredentials: true, observe: 'response' });
//   }

//   refreshToken(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/refresh`, { withCredentials: true, observe: 'response' });
//   }

//   registerUser(email: string, firstname: string, lastname: string, password: string): Observable<any> {
//     const newUser = { email: email, firstname: firstname, lastname: lastname, pwd: password };
//     return this.http.post(`${this.apiUrl}/register`, newUser, { observe: 'response' });
//   }
// }

// auth.service.ts
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
