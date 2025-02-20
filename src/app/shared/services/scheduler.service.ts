import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  private apiUrl = `${environment.apiUrl}scheduler`

  constructor(private http: HttpClient) {}

  sendScheduleAppointment(appointment: any): Observable<any> {
    return this.http.post(this.apiUrl, appointment);
  }
}
