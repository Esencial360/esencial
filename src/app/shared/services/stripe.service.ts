import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = `${environment.apiUrl}stripe`;

  constructor(private http: HttpClient) {}

    createSubscription(user: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/create-checkout-session`, user)
    }
}
