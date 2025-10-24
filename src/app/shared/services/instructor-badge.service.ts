import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular'; 

export interface InstructorBadge {
  badgeId: string;
  name: string;
  earnedOn: Date;
  icon: string;
}

export interface TeachingStreakResponse {
  message: string;
  teachingStreak: number;
  badges: InstructorBadge[];
}

export interface BadgeCheckResponse {
  message: string;
  badges: InstructorBadge[];
  totalClasses: number;
  teachingStreak: number;
}

export interface ClassApprovalRequest {
  videoId: string;
  type: 'video' | 'workshop';
}

export interface ClassApprovalResponse {
  message: string;
  badges: InstructorBadge[];
}

@Injectable({
  providedIn: 'root'
})
export class InstructorBadgeService {
  private apiUrl = 'your-api-base-url'; // Replace with your actual API URL

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /**
   * Updates teaching streak for an instructor
   * Call this when instructor completes teaching a class
   */
  updateTeachingStreak(instructorId: string): Observable<TeachingStreakResponse> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.patch<TeachingStreakResponse>(
          `${this.apiUrl}/instructor/${instructorId}/teaching-streak`, 
          {}, 
          { headers }
        );
      })
    );
  }

  /**
   * Handles class approval and badge checking
   * Call this when admin approves an instructor's class
   */
  approveClass(instructorId: string, approvalData: ClassApprovalRequest): Observable<ClassApprovalResponse> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        return this.http.patch<ClassApprovalResponse>(
          `${this.apiUrl}/instructor/${instructorId}/approve-class`, 
          approvalData, 
          { headers }
        );
      })
    );
  }

  /**
   * Gets all badges for a specific instructor
   */
  getInstructorBadges(instructorId: string): Observable<InstructorBadge[]> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<InstructorBadge[]>(
          `${this.apiUrl}/instructor/${instructorId}/badges`, 
          { headers }
        );
      })
    );
  }

  /**
   * Manually triggers badge check for an instructor
   * Useful for refreshing badges or periodic updates
   */
  checkInstructorBadges(instructorId: string): Observable<BadgeCheckResponse> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<BadgeCheckResponse>(
          `${this.apiUrl}/instructor/${instructorId}/check-badges`, 
          {}, 
          { headers }
        );
      })
    );
  }
}