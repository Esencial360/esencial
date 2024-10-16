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

  selectedBadge!: any
  openDialog!: boolean;

  onBadgeClick(badge: any) {
    this.openDialog = true
    this.selectedBadge = badge
    document.body.classList.add('overflow-hidden');
  }

  onDialogClose() {
    this.openDialog = false
  }

}
