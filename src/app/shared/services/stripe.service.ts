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

    getSubscription(userId: string) {
      return this.http.get(`${this.apiUrl}/${userId}`);
    }
  
    cancelSubscription(subscriptionId: string, authId: string, customerId: string) {
      return this.http.post(`${this.apiUrl}/cancel`, { subscriptionId, authId, customerId });
    }
  
    updateSubscription(data: { subscriptionId: string; newPriceId: string; userAuth: string; customerId: string;}) {
      return this.http.post(`${this.apiUrl}/update`, data);
    }
}
