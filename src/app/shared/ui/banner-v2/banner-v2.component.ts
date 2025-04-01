import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-v2',
  templateUrl: './banner-v2.component.html',
  styleUrl: './banner-v2.component.css',
})
export class BannerV2Component {
  @Input() text!: string;
  @Input() image!: string;
  @Input() title!: string;
  @Input() reverse!: boolean;
  


}
