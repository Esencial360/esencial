import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { StripeService } from '../../shared/services/stripe.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        console.log(user);

        const userData = {
          email: user.email,
          userId: user.sub,
          priceId: 'price_1RKfvAIKBryFAlYk6RjBFO0l',
        };
        this.stripeService
          .createSubscription(userData)
          .subscribe((res: any) => {
            window.location.href = res.url;
          });
      } else {
        console.log('no user');
      }
    });
  }
}
