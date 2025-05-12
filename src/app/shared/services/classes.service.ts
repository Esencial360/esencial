import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Classes } from '../Models/Classes';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  private apiUrl = `${environment.apiUrl}classes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllClasses(): Observable<Classes[]> {
    return this.http.get<Classes[]>(this.apiUrl);
  }

  getClass(id: any): Observable<Classes> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        console.log(token);
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<Classes>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }
  createClass(classVideo: Classes): Observable<Classes> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<Classes>(this.apiUrl, classVideo, { headers });
      })
    );
  }

  updateClass(classVideo: Classes): Observable<Classes> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.put<Classes>(this.apiUrl, classVideo, { headers });
      })
    );
  }

  deleteClass(id: string): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.delete<Classes>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }
}
