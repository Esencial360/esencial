import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}users`

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(map((users) => users || []));
  }

  getUser(email: any): Observable<any> {
    const url = `${this.apiUrl}/${email}`;
    return this.http.get<User>(url);
  }

  deleteUser(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  getStreak(id: string): Observable<{ streak: number }> {
    return this.http.get<{ streak: number }>(`${this.apiUrl}/get-streak/${id}`);
  }

  updateStreak(id: string): Observable<{ streak: number }> {
    return this.http.post<{ streak: number }>(
      `${this.apiUrl}/streak/${id}`,
      id
    );
  }
}
