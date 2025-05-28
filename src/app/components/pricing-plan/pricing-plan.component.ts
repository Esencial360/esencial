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
      name: 'ESPACIO ESENCIAL 360',
      price: 1,
      image: this.pullZone + '/assets/11.jpg',
      features: [
        'Te ofrecemos ser parte de los usuarios fundadores  durante el verano 2025.',
        '⁠Serás parte del grupo que estará guiándonos y retroalimentándonos para finalizar con detalle la mejor versión de nuestro espacio digital.',
        '⁠Atraves de encuestas y preguntas estaremos en contacto contigo para escucharte.',
      ],
    },
  ];

  constructor(public authService: AuthService) {}
}
