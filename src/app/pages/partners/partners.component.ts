import { Component } from '@angular/core';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css'
})
export class PartnersComponent {

  partners = [
    {
      name: 'Partner One',
      logo: 'assets/logos/partner1.png',
    },
    {
      name: 'Partner Two',
      logo: 'assets/logos/partner2.png',
    },
    {
      name: 'Partner Three',
      logo: 'assets/logos/partner3.png',
    },
    {
      name: 'Partner Four',
      logo: 'assets/logos/partner4.png',
    },
  ];

}
