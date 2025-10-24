import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectActiveUser } from '../../../state/user.selectors';
import { concatMap, from, map, Observable, toArray } from 'rxjs';
import { Store } from '@ngrx/store';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BadgeNotificationComponent } from '../../../shared/ui/badge-notification/badge-notification.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/users.service';
// import { BadgeService } from '../../../shared/services/badge.service';
import { User } from '../../../shared/Models/User';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent implements OnInit {
Number(arg0: string|undefined) {
throw new Error('Method not implemented.');
}
  @ViewChild('badgeNotification')
  badgeNotification!: BadgeNotificationComponent;
  user$!: any;
  @Input() filters!: string[];

  passwordForm!: FormGroup;
  message!: string;
  videos!: any;
  user: User | null = null;
  userId: string = '';
  updatingStreak = false;
  motivationalMessage = '';
  nextBadges: any[] = [];

  favoriteClasses = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private userService: UserService,
    // private badgeService: BadgeService
  ) {
    this.user$ = this.store.select(selectActiveUser);
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.user$.subscribe((user: any) => {
      this.getVideo(user.likedVideos);
      this.userId = user.id;
      this.loadUserProfile();
    });

    //  this.badgeService.newBadgeEarned.subscribe(badge => {
    //   if (this.badgeNotification) {
    //     this.badgeNotification.addNotification(badge);
    //   }
    //   this.showCelebration();
    // });
  }

  getVideo(videos: any) {
    // const videoIdsArray = videos.map((video: { guid: any }) => video.guid);
    // if (videoIdsArray.length === 0) {
    //   return;
    // }

    from(videos)
      .pipe(
        concatMap((videoId) =>
          this.bunnystreamService.getVideo('video', videoId).pipe(
            map((video) => {
              return {
                video: video,
                safeThumbnail: this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://vz-cbbe1d6f-d6a.b-cdn.net/${video.guid}/${
                    video.thumbnailFileName || 'thumbnail.jpg'
                  }`
                ),
              };
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: (videos) => {
          this.videos = videos;
        },
        error: (error) => {
          console.error('Error retrieving videos:', error);
        },
      });
  }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }

    const newPassword = this.passwordForm.get('newPassword')?.value;

    try {
      this.message = 'Password changed successfully';
      this.passwordForm.reset();
    } catch (error) {
      this.message = 'Error changing password. Please try again.';
      console.error('Error changing password:', error);
    }
  }

    loadUserProfile() {
    // Load user profile from your user service
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        // this.updateMotivationalMessage();
        // this.loadNextBadges();
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  //  updateStreak() {
  //   if (!this.user || this.updatingStreak) return;
    
  //   this.updatingStreak = true;
  //   this.badgeService.updateStreak(this.user._id).subscribe({
  //     next: (response) => {
  //       if (this.user && this.user.streak) {
  //         this.user.streak.count = String(response.streak);
  //       }
  //       this.user!.badges = response.badges;
  //       this.updatingStreak = false;
  //       this.updateMotivationalMessage();
  //       this.loadNextBadges();
  //     },
  //     error: (error) => {
  //       console.error('Error updating streak:', error);
  //       this.updatingStreak = false;
  //     }
  //   });
  // }
  //   loadNextBadges() {
  //   if (!this.user) return;
    
  //   const tenureDays = this.getDaysSinceJoined();
  //   this.nextBadges = this.badgeService.getNextBadgesToEarn(
  //     Number(this.user?.streak?.count),
  //     tenureDays
  //   );
  // }
  //   updateMotivationalMessage() {
  //   if (!this.user) return;
    
  //   const messages = [
  //     `¡Sigue así! Tu racha de ${this.user?.streak?.count ?? 0} días es inspiradora.`,
  //     `¡Increíble compromiso! ${this.user?.streak?.count ?? 0} días de práctica constante.`,
  //     `Tu dedicación es admirable. ¡${this.user?.streak?.count ?? 0} días y contando!`,
  //     `¡Eres imparable! ${this.user?.streak?.count ?? 0} días de yoga y bienestar.`,
  //     `Tu constancia inspira a otros. ¡${this.user?.streak?.count ?? 0} días de éxito!`
  //   ];
    
  //   if (this.user?.streak?.count ?? 0 === 0) {
  //     this.motivationalMessage = '¡Comienza tu racha hoy! Cada día cuenta.';
  //   } else if (this.user?.streak?.count ?? 0 < 7) {
  //     this.motivationalMessage = '¡Excelente comienzo! Mantén el impulso.';
  //   } else if (this.user?.streak?.count ?? 0 < 25) {
  //     this.motivationalMessage = messages[Math.floor(Math.random() * messages.length)];
  //   } else {
  //     this.motivationalMessage = `¡Fenomenal! ${this.user?.streak?.count ?? 0} días de práctica te convierten en un ejemplo a seguir.`;
  //   }
  // }

  getMotivationalEmoji(): string {
    const emojis = ['✨', '🌟', '💪', '🎯', '🚀', '🏆', '💫'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  getDaysSinceJoined(): number {
    if (!this.user) return 0;
    const createdAt = this.user.createdAt ?? '';
    const days = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getCurrentUserId(): string {
    // Get from your auth service
    return localStorage.getItem('userId') || '';
  }

  shareProfile() {
    // Implement share functionality
    const shareData = {
      title: 'Mi Perfil de Yoga',
      text: `¡He mantenido una racha de ${this.user?.streak?.count ?? 0} días en Esencial360!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  }

  showCelebration() {
    // Add celebration animation
    console.log('🎉 Celebration!');
  }
}
