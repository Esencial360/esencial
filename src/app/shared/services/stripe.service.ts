import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ReferralCodeService } from './referral-code.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = `${environment.apiUrl}stripe`;

  constructor(
    private http: HttpClient,
    private referralService: ReferralCodeService
  ) {}

  createSubscription(user: any): Observable<any> {
    const referralCode = this.referralService.getReferralCode();

    const userAndCode = {
      ...user,
      referralCode,
    };

    console.log(userAndCode);
    

    return this.http.post<any>(
      `${this.apiUrl}/create-checkout-session`,
      userAndCode
    );
  }

  getSubscription(userId: string) {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  cancelSubscription(
    subscriptionId: string,
    authId: string,
    customerId: string
  ) {
    return this.http.post(`${this.apiUrl}/cancel`, {
      subscriptionId,
      authId,
      customerId,
    });
  }

  updateSubscription(data: {
    subscriptionId: string;
    newPriceId: string;
    userAuth: string;
    customerId: string;
  }) {
    return this.http.post(`${this.apiUrl}/update`, data);
  }
}
