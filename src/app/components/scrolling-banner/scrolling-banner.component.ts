import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scrolling-banner',
  templateUrl: './scrolling-banner.component.html',
  styleUrl: './scrolling-banner.component.css',
})
export class ScrollingBannerComponent {
  pullZone = environment.pullZone;

  logos = [
    { src: this.pullZone + '/assets/laLoma.png', alt: 'Framer' },
    { src: this.pullZone + '/assets/powerYoga.png', alt: 'Flow the Sun' },
    { src: this.pullZone + '/assets/laLoma.png', alt: 'Framer' },
    { src: this.pullZone + '/assets/powerYoga.png', alt: 'Flow the Sun' },
    { src: this.pullZone + '/assets/laLoma.png', alt: 'Framer' },
    { src: this.pullZone + '/assets/powerYoga.png', alt: 'Flow the Sun' },
    { src: this.pullZone + '/assets/laLoma.png', alt: 'Framer' },
    { src: this.pullZone + '/assets/powerYoga.png', alt: 'Flow the Sun' },
  ];
}
