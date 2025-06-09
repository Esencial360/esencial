import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, switchMap } from 'rxjs';
import { Workshop } from '../Models/Workshop';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

   private apiUrl = `${environment.apiUrl}workshop`;
  
    constructor(private http: HttpClient, private auth: AuthService) {}
  
    getAllWorkshops(): Observable<Workshop[]> {
      return this.http.get<Workshop[]>(this.apiUrl);
    }
  
    getWorkshop(id: any): Observable<Workshop> {
      return this.auth.getAccessTokenSilently().pipe(
        switchMap((token: string) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.http.get<Workshop>(`${this.apiUrl}/${id}`, { headers });
        })
      );
    }
    createWorkshop(workshopVideo: Workshop): Observable<Workshop> {
      return this.auth.getAccessTokenSilently().pipe(
        switchMap((token: string) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.http.post<Workshop>(this.apiUrl, workshopVideo, { headers });
        })
      );
    }
  
    updateWorkshop(workshopVideo: Workshop): Observable<Workshop> {
      return this.auth.getAccessTokenSilently().pipe(
        switchMap((token: string) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.http.put<Workshop>(this.apiUrl, workshopVideo, { headers });
        })
      );
    }
  
    deleteWorkshop(id: string): Observable<any> {
      return this.auth.getAccessTokenSilently().pipe(
        switchMap((token: string) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
          return this.http.delete<Workshop>(`${this.apiUrl}/${id}`, { headers });
        })
      );
    }
}
