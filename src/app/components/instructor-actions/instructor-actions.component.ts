import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ClassApprovalRequest,
  InstructorBadgeService,
} from '../../shared/services/instructor-badge.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-instructor-actions',
  templateUrl: './instructor-actions.component.html',
  styleUrl: './instructor-actions.component.css',
})
export class InstructorActionsComponent {
  @Input() instructorId!: string;
  @Input() showAdminActions = false; // Set to true for admin users
  @Output() badgesUpdated = new EventEmitter<void>();

  // Teaching Streak Properties
  updatingStreak = false;
  streakMessage = '';
  streakMessageType: 'success' | 'error' = 'success';

  // Class Approval Properties
  approvingClass = false;
  approvalMessage = '';
  approvalMessageType: 'success' | 'error' = 'success';
  approvalForm: ClassApprovalRequest = {
    videoId: '',
    type: 'video',
  };

  private destroy$ = new Subject<void>();

  constructor(private instructorBadgeService: InstructorBadgeService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateTeachingStreak(): void {
    if (!this.instructorId) return;

    this.updatingStreak = true;
    this.clearStreakMessage();

    this.instructorBadgeService
      .updateTeachingStreak(this.instructorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.updatingStreak = false;
          this.streakMessageType = 'success';
          this.streakMessage = `Teaching streak updated! Current streak: ${response.teachingStreak} days`;

          // Check if new badges were earned
          if (response.badges && response.badges.length > 0) {
            this.streakMessage += ` 🎉 New badges earned!`;
          }

          this.badgesUpdated.emit();
          this.clearStreakMessage(5000); // Clear message after 5 seconds
        },
        error: (error) => {
          this.updatingStreak = false;
          this.streakMessageType = 'error';
          this.streakMessage =
            'Failed to update teaching streak. Please try again.';
          console.error('Error updating teaching streak:', error);
          this.clearStreakMessage(5000);
        },
      });
  }

  approveClass(): void {
    if (
      !this.instructorId ||
      !this.approvalForm.videoId ||
      !this.approvalForm.type
    )
      return;

    this.approvingClass = true;
    this.clearApprovalMessage();

    this.instructorBadgeService
      .approveClass(this.instructorId, this.approvalForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.approvingClass = false;
          this.approvalMessageType = 'success';
          this.approvalMessage = `Class approved successfully!`;

          // Check if new badges were earned
          if (response.badges && response.badges.length > 0) {
            this.approvalMessage += ` 🎉 New badges earned!`;
          }

          // Reset form
          this.approvalForm = { videoId: '', type: 'video' };

          this.badgesUpdated.emit();
          this.clearApprovalMessage(5000);
        },
        error: (error) => {
          this.approvingClass = false;
          this.approvalMessageType = 'error';
          this.approvalMessage = 'Failed to approve class. Please try again.';
          console.error('Error approving class:', error);
          this.clearApprovalMessage(5000);
        },
      });
  }

  private clearStreakMessage(delay = 0): void {
    if (delay > 0) {
      setTimeout(() => {
        this.streakMessage = '';
      }, delay);
    } else {
      this.streakMessage = '';
    }
  }

  private clearApprovalMessage(delay = 0): void {
    if (delay > 0) {
      setTimeout(() => {
        this.approvalMessage = '';
      }, delay);
    } else {
      this.approvalMessage = '';
    }
  }
}
