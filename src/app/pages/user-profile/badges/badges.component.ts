import { Component, Input } from '@angular/core';
import { Badge, BadgeProgress, BadgeService } from '../../../shared/services/badge.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.css'
})
export class BadgesComponent {
  @Input() userId!: string;
  @Input() currentStreak: number = 0;
  @Input() memberSince: Date = new Date();
  
  userBadges: Badge[] = [];
  allBadges: any[] = [];
  badgeProgress: BadgeProgress | null = null;
  loading = true;
  selectedBadge: any = null;
  showAllBadges = false;

  constructor(private badgeService: BadgeService) {}

  ngOnInit() {
    this.loadUserBadges();
    this.allBadges = this.badgeService.getAllBadgeDefinitions();
  }

  loadUserBadges() {
    if (!this.userId) return;
    
    this.loading = true;
    this.badgeService.getUserBadges(this.userId).subscribe({
      next: (badges) => {
        this.userBadges = badges;
        this.calculateProgress();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading badges:', error);
        this.loading = false;
      }
    });
  }

  calculateProgress() {
    const tenureDays = Math.floor(
      (new Date().getTime() - new Date(this.memberSince).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    this.badgeProgress = this.badgeService.calculateProgress(
      this.currentStreak, 
      tenureDays
    );
  }

  hasBadge(badgeId: string): boolean {
    return this.badgeService.hasBadge(badgeId, this.userBadges);
  }

  getBadgeDate(badgeId: string): Date | null {
    const badge = this.userBadges.find(b => b.badgeId === badgeId);
    return badge ? badge.earnedOn : null;
  }

  selectBadge(badge: any) {
    this.selectedBadge = badge;
  }

  closeBadgeDetails() {
    this.selectedBadge = null;
  }

  toggleBadgeView() {
    this.showAllBadges = !this.showAllBadges;
  }

  getProgressPercentage(current: number, target: number): number {
    return Math.min((current / target) * 100, 100);
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
}
