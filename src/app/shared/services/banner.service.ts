import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner } from '../Models/Banner';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = 'http://localhost:3000/api/banners'; 
  constructor(private http: HttpClient) {}

  getAllBanners(page: string): Observable<Banner[]> {
    return this.http.get<Banner[]>(`/api/banners/${page}`);
  }

  createBanner(banner: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, banner);
  }

  updateBanner(id: string, banner: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, banner);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
