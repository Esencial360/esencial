// services/badge.service.ts - Enhanced version with notification support
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Badge {
  badgeId: string;
  name: string;
  earnedOn: Date;
  icon: string;
}

export interface StreakUpdateResponse {
  message: string;
  streak: number;
  badges: Badge[];
}

export interface BadgeProgress {
  streakProgress: {
    current: number;
    nextMilestone: number;
    nextBadgeName: string;
    percentage: number;
  };
  tenureProgress: {
    daysActive: number;
    nextMilestone: number;
    nextBadgeName: string;
    percentage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  // private apiUrl = '/api'; // Adjust to your API base URL
  // private userBadgesSubject = new BehaviorSubject<Badge[]>([]);
  // public userBadges$ = this.userBadgesSubject.asObservable();
  
  // // Event emitter for new badges
  // public newBadgeEarned = new EventEmitter<Badge>();
  
  // // Subject for badge updates
  // private badgeUpdateSubject = new Subject<{type: string, data: any}>();
  // public badgeUpdates$ = this.badgeUpdateSubject.asObservable();

  // // Define all possible badges with their requirements
  // private readonly BADGE_DEFINITIONS = {
  //   STREAK_25: { 
  //     badgeId: 'streak_25', 
  //     name: 'Racha de 25 Días', 
  //     icon: 'assets/badges/streak-25.svg',
  //     requirement: 25,
  //     type: 'streak',
  //     description: 'Mantén una práctica constante durante 25 días consecutivos',
  //     color: 'from-orange-400 to-yellow-400'
  //   },
  //   STREAK_50: { 
  //     badgeId: 'streak_50', 
  //     name: 'Racha de 50 Días', 
  //     icon: 'assets/badges/streak-50.svg',
  //     requirement: 50,
  //     type: 'streak',
  //     description: 'Impresionante constancia: 50 días seguidos de práctica',
  //     color: 'from-orange-500 to-red-500'
  //   },
  //   STREAK_100: { 
  //     badgeId: 'streak_100', 
  //     name: 'Centenario', 
  //     icon: 'assets/badges/streak-100.svg',
  //     requirement: 100,
  //     type: 'streak',
  //     description: '¡100 días de dedicación continua! Eres inspiración',
  //     color: 'from-purple-500 to-pink-500'
  //   },
  //   TENURE_1_YEAR: { 
  //     badgeId: 'tenure_1_year', 
  //     name: 'Yogui de 1 Año', 
  //     icon: 'assets/badges/anniversary-1.svg',
  //     requirement: 365,
  //     type: 'tenure',
  //     description: 'Un año completo en tu viaje de yoga',
  //     color: 'from-blue-400 to-purple-400'
  //   },
  //   TENURE_2_YEAR: { 
  //     badgeId: 'tenure_2_year', 
  //     name: 'Yogui de 2 Años', 
  //     icon: 'assets/badges/anniversary-2.svg',
  //     requirement: 730,
  //     type: 'tenure',
  //     description: 'Dos años de crecimiento y transformación',
  //     color: 'from-purple-500 to-indigo-500'
  //   },
  //   TENURE_3_YEAR: { 
  //     badgeId: 'tenure_3_year', 
  //     name: 'Maestro Yogui', 
  //     icon: 'assets/badges/anniversary-3.svg',
  //     requirement: 1095,
  //     type: 'tenure',
  //     description: 'Tres años de sabiduría y práctica',
  //     color: 'from-indigo-500 to-purple-600'
  //   }
  // };

  // constructor(private http: HttpClient) {
  //   // Initialize from session storage if available
  //   const cachedBadges = this.getCachedBadges();
  //   if (cachedBadges.length > 0) {
  //     this.userBadgesSubject.next(cachedBadges);
  //   }
  // }

  // /**
  //  * Get badges for a specific user
  //  */
  // getUserBadges(userId: string): Observable<Badge[]> {
  //   return this.http.get<Badge[]>(`${this.apiUrl}/users/${userId}/badges`)
  //     .pipe(
  //       tap(badges => {
  //         this.userBadgesSubject.next(badges);
  //         this.cacheBadges(badges);
  //       })
  //     );
  // }

  // /**
  //  * Update user streak and check for new badges
  //  */
  // updateStreak(userId: string): Observable<StreakUpdateResponse> {
  //   return this.http.post<StreakUpdateResponse>(`${this.apiUrl}/users/${userId}/streak`, {})
  //     .pipe(
  //       tap((response) => {
  //         if (response.badges) {
  //           const previousBadges = this.userBadgesSubject.value;
  //           this.userBadgesSubject.next(response.badges);
  //           this.cacheBadges(response.badges);
            
  //           // Check for new badges and emit events
  //           const newBadges = this.findNewBadges(previousBadges, response.badges);
  //           newBadges.forEach(badge => {
  //             this.newBadgeEarned.emit(badge);
  //             this.showBadgeAnimation(badge);
  //           });
            
  //           // Update progress
  //           this.badgeUpdateSubject.next({
  //             type: 'streak_update',
  //             data: { streak: response.streak, badges: response.badges }
  //           });
  //         }
  //       })
  //     );
  // }

  // /**
  //  * Get all available badges (for display purposes)
  //  */
  // getAllBadgeDefinitions() {
  //   return Object.values(this.BADGE_DEFINITIONS);
  // }

  // /**
  //  * Get next badges to earn
  //  */
  // getNextBadgesToEarn(currentStreak: number, tenureDays: number): any[] {
  //   const nextBadges = [];
  //   const allBadges = this.getAllBadgeDefinitions();
  //   const userBadges = this.userBadgesSubject.value;
    
  //   // Find next streak badge
  //   const streakBadges = allBadges
  //     .filter(b => b.type === 'streak' && !this.hasBadge(b.badgeId, userBadges))
  //     .sort((a, b) => a.requirement - b.requirement);
    
  //   if (streakBadges.length > 0) {
  //     nextBadges.push({
  //       ...streakBadges[0],
  //       progress: (currentStreak / streakBadges[0].requirement) * 100,
  //       daysRemaining: streakBadges[0].requirement - currentStreak
  //     });
  //   }
    
  //   // Find next tenure badge
  //   const tenureBadges = allBadges
  //     .filter(b => b.type === 'tenure' && !this.hasBadge(b.badgeId, userBadges))
  //     .sort((a, b) => a.requirement - b.requirement);
    
  //   if (tenureBadges.length > 0) {
  //     nextBadges.push({
  //       ...tenureBadges[0],
  //       progress: (tenureDays / tenureBadges[0].requirement) * 100,
  //       daysRemaining: tenureBadges[0].requirement - tenureDays
  //     });
  //   }
    
  //   return nextBadges;
  // }

  // /**
  //  * Calculate progress towards next badges
  //  */
  // calculateProgress(currentStreak: number, tenureDays: number): BadgeProgress {
  //   // Calculate streak progress
  //   let nextStreakMilestone = 25;
  //   let nextStreakBadgeName = 'Racha de 25 Días';
    
  //   if (currentStreak >= 25 && currentStreak < 50) {
  //     nextStreakMilestone = 50;
  //     nextStreakBadgeName = 'Racha de 50 Días';
  //   } else if (currentStreak >= 50 && currentStreak < 100) {
  //     nextStreakMilestone = 100;
  //     nextStreakBadgeName = 'Centenario';
  //   } else if (currentStreak >= 100) {
  //     nextStreakMilestone = 200; // Future badge
  //     nextStreakBadgeName = 'Leyenda del Yoga';
  //   }

  //   // Calculate tenure progress
  //   let nextTenureMilestone = 365;
  //   let nextTenureBadgeName = 'Yogui de 1 Año';
    
  //   if (tenureDays >= 365 && tenureDays < 730) {
  //     nextTenureMilestone = 730;
  //     nextTenureBadgeName = 'Yogui de 2 Años';
  //   } else if (tenureDays >= 730 && tenureDays < 1095) {
  //     nextTenureMilestone = 1095;
  //     nextTenureBadgeName = 'Maestro Yogui';
  //   } else if (tenureDays >= 1095) {
  //     nextTenureMilestone = 1825; // 5 years
  //     nextTenureBadgeName = 'Gran Maestro';
  //   }

  //   return {
  //     streakProgress: {
  //       current: currentStreak,
  //       nextMilestone: nextStreakMilestone,
  //       nextBadgeName: nextStreakBadgeName,
  //       percentage: Math.min((currentStreak / nextStreakMilestone) * 100, 100)
  //     },
  //     tenureProgress: {
  //       daysActive: tenureDays,
  //       nextMilestone: nextTenureMilestone,
  //       nextBadgeName: nextTenureBadgeName,
  //       percentage: Math.min((tenureDays / nextTenureMilestone) * 100, 100)
  //     }
  //   };
  // }

  // /**
  //  * Check if user has a specific badge
  //  */
  // hasBadge(badgeId: string, userBadges?: Badge[]): boolean {
  //   const badges = userBadges || this.userBadgesSubject.value;
  //   return badges.some(badge => badge.badgeId === badgeId);
  // }

  // /**
  //  * Get badge details by ID
  //  */
  // getBadgeDetails(badgeId: string) {
  //   return Object.values(this.BADGE_DEFINITIONS).find(
  //     badge => badge.badgeId === badgeId
  //   );
  // }

  // /**
  //  * Get user's badge statistics
  //  */
  // getBadgeStats(userId: string): Observable<any> {
  //   return this.getUserBadges(userId).pipe(
  //     map(badges => {
  //       const totalAvailable = this.getAllBadgeDefinitions().length;
  //       const earned = badges.length;
  //       const streakBadges = badges.filter(b => 
  //         this.getBadgeDetails(b.badgeId)?.type === 'streak'
  //       ).length;
  //       const tenureBadges = badges.filter(b => 
  //         this.getBadgeDetails(b.badgeId)?.type === 'tenure'
  //       ).length;
        
  //       return {
  //         total: totalAvailable,
  //         earned,
  //         percentage: (earned / totalAvailable) * 100,
  //         streakBadges,
  //         tenureBadges,
  //         latestBadge: badges.sort((a, b) => 
  //           new Date(b.earnedOn).getTime() - new Date(a.earnedOn).getTime()
  //         )[0]
  //       };
  //     })
  //   );
  // }

  // /**
  //  * Private helper methods
  //  */
  // private findNewBadges(oldBadges: Badge[], newBadges: Badge[]): Badge[] {
  //   return newBadges.filter(
  //     newBadge => !oldBadges.some(oldBadge => oldBadge.badgeId === newBadge.badgeId)
  //   );
  // }

  // private cacheBadges(badges: Badge[]) {
  //   try {
  //     sessionStorage.setItem('userBadges', JSON.stringify(badges));
  //     sessionStorage.setItem('badgesCachedAt', new Date().toISOString());
  //   } catch (e) {
  //     console.error('Could not cache badges:', e);
  //   }
  // }

  // private getCachedBadges(): Badge[] {
  //   try {
  //     const cached = sessionStorage.getItem('userBadges');
  //     const cachedAt = sessionStorage.getItem('badgesCachedAt');
      
  //     if (cached && cachedAt) {
  //       const cacheAge = Date.now() - new Date(cachedAt).getTime();
  //       const maxAge = 1000 * 60 * 30; // 30 minutes
        
  //       if (cacheAge < maxAge) {
  //         return JSON.parse(cached);
  //       }
  //     }
  //   } catch (e) {
  //     console.error('Could not retrieve cached badges:', e);
  //   }
  //   return [];
  // }

  // private showBadgeAnimation(badge: Badge) {
  //   // This would trigger a visual celebration
  //   // Could be connected to a global animation service
  //   console.log('🎉 New badge earned:', badge.name);
  // }
}