import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Instructor } from '../Models/Instructor';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private apiUrl = `${environment.apiUrl}instructors`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }

  getInstructor(id?: string): Observable<Instructor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Instructor>(url);
  }

  createInstructor(instructor: FormData): Observable<Instructor> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<Instructor>(`${this.apiUrl}`, instructor, {
          headers,
        });
      })
    );
  }

  updateInstructor(instructor: FormData | Instructor): Observable<Instructor> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.put<Instructor>(`${this.apiUrl}`, instructor, {
          headers,
        });
      })
    );
  }

  deleteInstructor(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.delete<Instructor>(`${url}`, { headers });
      })
    );
  }

  getReferrals(id: string | undefined): Observable<any> {
    const url = `${this.apiUrl}/referral-stats/${id}`;
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<Instructor>(`${url}`, { headers });
      })
    );
  }

  stripeOnboarding(id: string | undefined): Observable<any> {
    const url = `${this.apiUrl}/onboarding-url/${id}`;
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<Instructor>(`${url}`, { headers });
      })
    );
  }
}
