import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/email';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, emailData);
  }

  sendContactForm(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, formData);
  }

  sendNewInstructor(formData: any): Observable<any> {
    console.log(this.apiUrl);
    return this.http.post(`${this.apiUrl}/new-instructor`, formData);
  }
}
