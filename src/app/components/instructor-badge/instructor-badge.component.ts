import { Component, Input } from '@angular/core';
import { InstructorBadge, InstructorBadgeService } from '../../shared/services/instructor-badge.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-instructor-badge',
  templateUrl: './instructor-badge.component.html',
  styleUrl: './instructor-badge.component.css'
})
export class InstructorBadgeComponent {

   @Input() instructorId!: string;
  
  badges: InstructorBadge[] = [];
  badgeStats: { totalClasses: number; teachingStreak: number } | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private instructorBadgeService: InstructorBadgeService) {}

  ngOnInit(): void {
    if (this.instructorId) {
      this.loadBadges();
      this.loadBadgeStats();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBadges(): void {
    this.loading = true;
    this.instructorBadgeService.getInstructorBadges(this.instructorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (badges) => {
          this.badges = badges;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading badges:', error);
          this.loading = false;
        }
      });
  }

  loadBadgeStats(): void {
    this.instructorBadgeService.checkInstructorBadges(this.instructorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.badgeStats = {
            totalClasses: response.totalClasses,
            teachingStreak: response.teachingStreak
          };
        },
        error: (error) => {
          console.error('Error loading badge stats:', error);
        }
      });
  }

  refreshBadges(): void {
    this.loadBadges();
    this.loadBadgeStats();
  }

  getBadgeCategory(badgeId: string): string {
    if (badgeId.includes('classes_')) return 'Classes';
    if (badgeId.includes('teaching_streak_')) return 'Streak';
    if (badgeId.includes('instructor_')) return 'Tenure';
    return 'Achievement';
  }

  getBadgeCategoryClass(badgeId: string): string {
    if (badgeId.includes('classes_')) return 'bg-blue-100 text-blue-800';
    if (badgeId.includes('teaching_streak_')) return 'bg-green-100 text-green-800';
    if (badgeId.includes('instructor_')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  }

}
