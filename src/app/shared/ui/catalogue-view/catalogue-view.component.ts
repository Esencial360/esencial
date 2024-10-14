import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalogue-view',
  templateUrl: './catalogue-view.component.html',
  styleUrl: './catalogue-view.component.css'
})
export class CatalogueViewComponent {

  @Input()
  title!: string;

  @Input()
  subtitle!: string;

  @Input()
  description!: string;

  @Input()
  catalogue!: any[]


}
