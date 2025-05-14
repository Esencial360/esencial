import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

interface PricingPlan {
  name: string;
  price: number;
  highlight?: string;
  features: string[];
  image: string;
}

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css',
})
export class PricingPlanComponent {
  pullZone: string = environment.pullZone;
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
    },
  ];

  constructor(public authService: AuthService) {}
}
