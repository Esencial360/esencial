import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Counselor } from '../Models/Counselor';

@Injectable({
  providedIn: 'root'
})
export class CounselService {

   private apiUrl = `${environment.apiUrl}counselors`;
  
    constructor(private http: HttpClient) { }
  
    getAllCounselors(): Observable<Counselor[]> {
      return this.http.get<Counselor[]>(this.apiUrl);
    }
  
    getCounselor(id: string): Observable<Counselor> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Counselor>(url);
    }
  
    createCounselor(counselor: Counselor): Observable<Counselor> {
      return this.http.post<Counselor>(this.apiUrl, counselor);
    }
  
    updateCounselor(counselor: Counselor): Observable<Counselor> {
      return this.http.put<Counselor>(this.apiUrl, counselor);
    }
  
    deleteCounselor(id: string): Observable<any> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete(url);
    }
}
