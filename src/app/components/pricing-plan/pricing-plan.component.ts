import { Component } from '@angular/core';

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
}

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrl: './pricing-plan.component.css'
})
export class PricingPlanComponent {
  plans: PricingPlan[] = [
    {
      name: 'ENERGY BOOSTER',
      price: 18,
      features: [
        'Dynamic yoga program for energy',
        '10 yoga classes per month, including dynamic Vinyasa sessions',
        'Monthly workshops on nutrition and wellness',
        'Priority access to special events'
      ]
    },
    {
      name: 'MINDFUL PRO',
      price: 24,
      features: [
        'Unlimited access to all classes and workshops',
        'Personalized wellness coaching sessions',
        'Access to exclusive yoga retreats at a discounted rate',
        'Access to all basic features'
      ]
    },
    {
      name: 'ULTIMATE ZEN',
      price: 32,
      features: [
        'Premium yoga experience with exclusive benefits',
        'Unlimited access + free guest pass to all classes',
        'Private yoga sessions with international experts',
        'Premium welcome pack and discounts on partner products'
      ]
    }
  ];

}
