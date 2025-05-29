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
export class SignUpComponent implements OnInit {
  selectedPlan!: string;
  loading = false;
  noUser!: boolean;
  pullZone = environment.pullZone;
  plans: PricingPlan[] = [
    // {
    //   name: 'esencial360',
    //   highlight: '360',
    //   price: 98,
    //   image: this.pullZone + '/assets/10.jpg',
    //   features: [
    //     'Acceso completo de la plataforma.',
    //     'Asesoría personalizada.',
    //     'Promoción de estudio o marca personal',
    //     'Acceso gratutito a talleres especiales y eventos.',
    //   ],
    //   priceId: 'price_1RKfvQIKBryFAlYkZTsaDoy6',
    // },
    {
      name: 'esencial360',
      price: 1,
      image: this.pullZone + '/assets/11.jpg',
      features: [
        'Te ofrecemos ser parte de los usuarios fundadores  durante el verano 2025.',
        '⁠Serás parte del grupo que estará guiándonos y retroalimentándonos para finalizar con detalle la mejor versión de nuestro espacio digital.',
        '⁠Atraves de encuestas y preguntas estaremos en contacto contigo para escucharte.',
      ],
      priceId: 'price_1RKIDlEmYKUZdsXfxutFY1VS',
    },
  ];

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private stripeService: StripeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = false
  }

  selectPlan(plan: string) {
    this.selectedPlan = plan;

  }

  subscribe() {
    if (!this.selectedPlan) return;

    this.loading = true;

    const priceId = 'price_1RKIDlEmYKUZdsXfxutFY1VS'

    this.auth.user$.subscribe((user) => {
      if (user) {
        this.noUser = false
        
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
      } else {
        
        this.noUser = true;
        this.loading = false;
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
