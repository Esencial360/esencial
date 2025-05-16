import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { Meditation } from '../Models/Meditation';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeditationService {
  private apiUrl = `${environment.apiUrl}meditations`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllMeditation(): Observable<Meditation[]> {
    return this.http.get<Meditation[]>(this.apiUrl);
  }

  getMeditation(id: any): Observable<Meditation> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<Meditation>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }
  createMeditation(meditationVideo: FormData): Observable<Meditation> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<Meditation>(`${this.apiUrl}`, meditationVideo, {
          headers,
        });
      })
    );
  }

  updateMeditation(meditationVideo: Meditation): Observable<Meditation> {
    return this.http.put<Meditation>(this.apiUrl, meditationVideo);
  }

  deleteMeditation(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
