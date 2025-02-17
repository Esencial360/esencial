import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  private apiUrl = `https://seal-app-jeede.ondigitalocean.app/scheduler`;

  constructor(private http: HttpClient) {}

  sendScheduleAppointment(appointment: any): Observable<any> {
    return this.http.post(this.apiUrl, appointment);
  }
}
