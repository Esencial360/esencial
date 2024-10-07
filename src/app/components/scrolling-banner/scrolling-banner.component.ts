import { Component } from '@angular/core';

@Component({
  selector: 'app-scrolling-banner',
  templateUrl: './scrolling-banner.component.html',
  styleUrl: './scrolling-banner.component.css'
})
export class ScrollingBannerComponent {

  logos = [
    { src: '../../../assets/images/logo.png', alt: 'Framer' },
    { src: '../../../assets/images/logo.png', alt: 'Flow the Sun' },
    { src: '../../../assets/images/logo.png', alt: 'Framer' },
    { src: '../../../assets/images/logo.png', alt: 'Flow the Sun' },
    { src: '../../../assets/images/logo.png', alt: 'Framer' },
    { src: '../../../assets/images/logo.png', alt: 'Flow the Sun' }
  ];

}
