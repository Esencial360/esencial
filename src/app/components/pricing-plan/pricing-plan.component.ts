import { Component } from '@angular/core';

interface PricingPlan {
  name: string;
  price: number;
  highlight?: string;
  features: string[];
  image: string
}

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css'
})
export class PricingPlanComponent {
  plans: PricingPlan[] = [
    {
      name: 'esencial360',
      highlight: '360',
      price: 98,
      image: '/assets/images/10.png',
      features: [
        'Acceso completo de la plataforma.',
        'Asesoría personalizada.',
        'Promoción de estudio o marca personal',
        'Acceso gratutito a talleres especiales y eventos.'
      ]
    },
    {
      name: 'esencial',
      price: 58,
      image: '/assets/images/11.png',
      features: [
        'Accesso a clases de yoga y meditaciones',
        'Asesoría básica.',
        'Descuente a talleres especiales y eventos.',
      ]
    },
  ];

}
