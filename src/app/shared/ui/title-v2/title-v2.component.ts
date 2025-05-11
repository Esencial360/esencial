import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-v2',
  templateUrl: './title-v2.component.html',
  styleUrl: './title-v2.component.css'
})
export class TitleV2Component {

  @Input() title!: string
  @Input() description!: string
  @Input() image!: string
  @Input() closingTitle!: string;

}
