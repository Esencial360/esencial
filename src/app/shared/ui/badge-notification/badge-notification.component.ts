// components/badge-notification/badge-notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

export interface BadgeNotification {
  id: string;
  badge: {
    name: string;
    icon: string;
    description?: string;
  };
  timestamp: Date;
}

@Component({
  selector: 'app-badge-notification',
  templateUrl: './badge-notification.component.html',
  styleUrl: './badge-notification.component.css'
})
export class BadgeNotificationComponent implements OnInit, OnDestroy {
  notifications: BadgeNotification[] = [];
  private notificationSubscription?: Subscription;
  private autoRemoveTimers = new Map<string, any>();

  ngOnInit() {
    // Subscribe to badge notification events
    // This would come from your badge service or a dedicated notification service
    this.listenForBadgeNotifications();
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    // Clear all timers
    this.autoRemoveTimers.forEach(timer => clearTimeout(timer));
  }

  listenForBadgeNotifications() {
    // This would connect to your badge service or event emitter
    // For now, it's a placeholder
  }

  addNotification(badge: any) {
    const notification: BadgeNotification = {
      id: `badge-${Date.now()}`,
      badge: badge,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    
    // Auto-remove after 5 seconds
    const timer = setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
    
    this.autoRemoveTimers.set(notification.id, timer);
    
    // Play celebration sound (optional)
    this.playCelebrationSound();
  }

  removeNotification(id: string) {
    const timer = this.autoRemoveTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.autoRemoveTimers.delete(id);
    }
    
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  trackByNotificationId(index: number, notification: BadgeNotification): string {
    return notification.id;
  }

  private playCelebrationSound() {
    // Optional: Play a celebration sound
    // You can add an audio element or use the Web Audio API
    try {
      const audio = new Audio('assets/sounds/achievement.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play sound:', e));
    } catch (e) {
      console.log('Audio not supported');
    }
  }
}