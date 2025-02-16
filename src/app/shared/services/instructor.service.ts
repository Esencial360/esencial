import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../Models/Instructor'; // Import the Instructor model interface

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'http://localhost:3000/instructors';

  constructor(private http: HttpClient) { }

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }

  getInstructor(id: string): Observable<Instructor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Instructor>(url);
  }

  createInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(this.apiUrl, instructor);
  }

  updateInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.put<Instructor>(this.apiUrl, instructor);
  }

  deleteInstructor(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}