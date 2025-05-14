import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { StripeService } from '../../shared/services/stripe.service';
import { environment } from '../../../environments/environment';
import {
  DialogComponent,
  DialogData,
} from '../../shared/ui/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

interface PricingPlan {
  name: string;
  price: number;
  highlight?: string;
  features: string[];
  image: string;
  priceId: string;
}
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  selectedPlan!: string;
  loading = false;
  pullZone = environment.pullZone;
  plans: PricingPlan[] = [
    {
      name: 'esencial360',
      highlight: '360',
      price: 98,
      image: this.pullZone + '/assets/10.jpg',
      features: [
        'Acceso completo de la plataforma.',
        'Asesoría personalizada.',
        'Promoción de estudio o marca personal',
        'Acceso gratutito a talleres especiales y eventos.',
      ],
      priceId: 'price_1RKfvQIKBryFAlYkZTsaDoy6',
    },
    {
      name: 'esencial',
      price: 58,
      image: this.pullZone + '/assets/11.jpg',
      features: [
        'Accesso a clases de yoga y meditaciones',
        'Asesoría básica.',
        'Descuente a talleres especiales y eventos.',
      ],
      priceId: 'price_1RKfvAIKBryFAlYk6RjBFO0l',
    },
  ];

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private stripeService: StripeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  async subscribe() {
    if (!this.selectedPlan) return;

    this.loading = true;

    const priceId =
      this.selectedPlan === 'esencial'
        ? 'price_1RKfvAIKBryFAlYk6RjBFO0l'
        : 'price_1RKfvQIKBryFAlYkZTsaDoy6';

    this.auth.user$.subscribe((user) => {
      if (user) {

        const userData = {
          email: user.email,
          userId: user.sub,
          priceId,
        };
        this.stripeService.createSubscription(userData).subscribe({
          next: (res: any) => {
            window.location.href = res.url;
          },
          error: (err) => {
            if (err.error.error === 'User already has an active subscription.') {
              this.showErrorMessage()
            }
            this.loading = false;
          },
        });
      }
    });
  }

  showErrorMessage() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Error',
        message: 'Ya cuentas con una subscripcion activa. Si deseas actualizarla, hazlo desde la pagina de ajustes en tu perfil',
        confirmText: 'Aceptar',
        onConfirm: () => {
          this.router.navigate(['']);
        },
      } as DialogData,
    });
  }
}
