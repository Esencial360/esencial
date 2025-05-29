import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { StripeService } from '../../shared/services/stripe.service';
import { switchMap, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-management',
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.css',
})
export class SubscriptionManagementComponent implements OnInit {
  subscriptionInfo: any;
  loading = true;
  error = '';
  updating = false;
  subscription: any;
  hasActiveSubscription = false;
  subscriptionStatusLoaded = false;
  userAuth!: string;

  constructor(
    private auth: AuthService,
    private stripeService: StripeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionStatusLoaded = false;
    this.auth.user$.pipe(take(1)).subscribe((user: any) => {
      if (user) {
        this.userAuth = user.sub;
        this.checkSubscription(user.sub);
      }
    });
  }

  checkSubscription(userId: string) {
    this.stripeService.getSubscription(userId).subscribe({
      next: (res: any) => {
        this.subscription = res;
        this.subscriptionInfo = res;
        this.updating = false;

        this.hasActiveSubscription = res.status === 'active';
        this.subscriptionStatusLoaded = true;
        this.loading = false;
      },
      error: () => {
        this.hasActiveSubscription = false;
        this.subscriptionStatusLoaded = true;
        this.loading = false;
        this.updating = false;
      },
    });
  }

  changePlan(newPriceId: string) {
    if (!this.subscriptionInfo) return;
    this.updating = true;
    this.stripeService
      .updateSubscription({
        subscriptionId: this.subscriptionInfo.id,
        newPriceId,
        userAuth: this.userAuth,
        customerId: this.subscriptionInfo.customerId,
      })
      .subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: (err) => {
          console.error(err);
          this.updating = false;
        },
      });
  }

  getFallbackPlanName(priceId: string): string {
    switch (priceId) {
      case 'price_1RKIDlEmYKUZdsXfxutFY1VS':
        return 'Eesencial360';
      default:
        return 'Freemium';
    }
  }

  cancelSubscription() {
    if (!this.subscriptionInfo) return;
    this.updating = true;
    this.subscriptionStatusLoaded = false;
    this.stripeService
      .cancelSubscription(
        this.subscriptionInfo.id,
        this.userAuth,
        this.subscriptionInfo.customerId
      )
      .subscribe({
        next: () => {
          this.subscriptionInfo.status = 'canceled';
          this.updating = false;
          this.subscriptionStatusLoaded = true;
          this.ngOnInit();
        },
        error: (err) => {
          console.error(err);
          this.updating = false;
          this.subscriptionStatusLoaded = true;
          this.ngOnInit();
        },
      });
  }

  subscribe() {
    this.router.navigate(['/suscribe']);
  }
}
