import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReferralCodeService {
  private referralCodeKey = 'referral_code';

  setReferralCode(code: string) {
    localStorage.setItem(this.referralCodeKey, code);
  }

  getReferralCode(): string | null {
    return localStorage.getItem(this.referralCodeKey);
  }

  clearReferralCode() {
    localStorage.removeItem(this.referralCodeKey);
  }
}
