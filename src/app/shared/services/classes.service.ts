import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classes } from '../Models/Classes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = `${environment.apiUrl}classes`;

  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<Classes[]> {
    return this.http.get<Classes[]>(this.apiUrl);
  }

  getClass(id: any): Observable<Classes> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Classes>(url);
  }

  createClass(classVideo: Classes): Observable<Classes> {
    return this.http.post<Classes>(this.apiUrl, classVideo);
  }

  updateClass(classVideo: Classes): Observable<Classes> {
    return this.http.put<Classes>(this.apiUrl, classVideo);
  }

  deleteClass(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}