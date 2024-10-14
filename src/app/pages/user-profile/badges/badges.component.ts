import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.css'
})
export class BadgesComponent {

  @Input()
  title!: string;

  @Input()
  subtitle!: string;

  @Input()
  description!: string;

  @Input()
  badges!: any[]

  @Input()
  futureBadges!: any[]

}
