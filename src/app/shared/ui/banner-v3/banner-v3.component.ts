import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-v3',
  templateUrl: './banner-v3.component.html',
  styleUrl: './banner-v3.component.css'
})
export class BannerV3Component {

  @Input() firstDescriptions!: string;
  @Input() secondDescription!: string;
  @Input() image!: string;

}
