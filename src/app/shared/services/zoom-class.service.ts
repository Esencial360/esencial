import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
export interface ZoomClass {
  _id?: string;
  title: string;
  description: string;
  instructor?: string;
  instructorName: string;
  zoomLink: string;
  meetingId?: string;
  password?: string;
  scheduledDate: Date | string;
  duration: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  category:
    | 'Hatha'
    | 'Vinyasa'
    | 'Ashtanga'
    | 'Yin'
    | 'Kundalini'
    | 'Meditación'
    | 'Otro';
  maxParticipants: number;
  registeredUsers?: string[];
  isActive?: boolean;
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFull?: boolean;
  isUpcoming?: boolean;
}

export interface ZoomClassResponse {
  success: boolean;
  message?: string;
  data?: ZoomClass | ZoomClass[];
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ZoomClassService {
  private apiUrl = `${environment.apiUrl}zoom-classes`;
  private upcomingClassesSubject = new BehaviorSubject<ZoomClass[]>([]);
  public upcomingClasses$ = this.upcomingClassesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all Zoom classes with optional filters
   */
  getZoomClasses(filters?: {
    status?: string;
    upcoming?: boolean;
    instructor?: string;
    limit?: number;
    page?: number;
  }): Observable<ZoomClassResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.upcoming !== undefined)
        params = params.set('upcoming', filters.upcoming.toString());
      if (filters.instructor)
        params = params.set('instructor', filters.instructor);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
    }

    return this.http.get<ZoomClassResponse>(this.apiUrl, { params });
  }

  /**
   * Get upcoming Zoom classes
   */
  getUpcomingClasses(limit: number = 5): Observable<ZoomClassResponse> {
    return this.http
      .get<ZoomClassResponse>(`${this.apiUrl}/upcoming`, {
        params: { limit: limit.toString() },
      })
      .pipe(
        tap((response) => {
          if (response.success && Array.isArray(response.data)) {
            this.upcomingClassesSubject.next(response.data);
          }
        })
      );
  }

  /**
   * Get a single Zoom class by ID
   */
  getZoomClassById(id: string): Observable<ZoomClassResponse> {
    return this.http.get<ZoomClassResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new Zoom class (Admin only)
   */
  createZoomClass(
    zoomClass: Partial<ZoomClass>
  ): Observable<ZoomClassResponse> {
    return this.http.post<ZoomClassResponse>(this.apiUrl, zoomClass);
  }

  /**
   * Update a Zoom class (Admin only)
   */
  updateZoomClass(
    id: string,
    zoomClass: Partial<ZoomClass>
  ): Observable<ZoomClassResponse> {
    return this.http.put<ZoomClassResponse>(`${this.apiUrl}/${id}`, zoomClass);
  }

  /**
   * Delete a Zoom class (Admin only)
   */
  deleteZoomClass(id: string): Observable<ZoomClassResponse> {
    return this.http.delete<ZoomClassResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Register for a Zoom class
   */
  registerForClass(id: string): Observable<ZoomClassResponse> {
    return this.http.post<ZoomClassResponse>(
      `${this.apiUrl}/${id}/register`,
      {}
    );
  }

  /**
   * Unregister from a Zoom class
   */
  unregisterFromClass(id: string): Observable<ZoomClassResponse> {
    return this.http.post<ZoomClassResponse>(
      `${this.apiUrl}/${id}/unregister`,
      {}
    );
  }

  /**
   * Get user's registered classes
   */
  getMyClasses(): Observable<ZoomClassResponse> {
    return this.http.get<ZoomClassResponse>(`${this.apiUrl}/my-classes`);
  }

  /**
   * Check if a class is happening now
   */
  isClassLive(scheduledDate: Date | string, duration: number): boolean {
    const now = new Date();
    const classStart = new Date(scheduledDate);
    const classEnd = new Date(classStart.getTime() + duration * 60000);

    return now >= classStart && now <= classEnd;
  }

  /**
   * Get time until class starts
   */
  getTimeUntilClass(scheduledDate: Date | string): string {
    const now = new Date();
    const classTime = new Date(scheduledDate);
    const diff = classTime.getTime() - now.getTime();

    if (diff < 0) return 'Ya comenzó';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Format date for display
   */
  formatClassDate(date: Date | string): string {
    const classDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return classDate.toLocaleDateString('es-ES', options);
  }

  /**
   * Get live Zoom classes (currently happening)
   */
  getLiveZoomClasses(): Observable<ZoomClassResponse> {
    return this.http.get<ZoomClassResponse>(`${this.apiUrl}/live`);
  }

  /**
   * Update class status (Admin only)
   */
  updateClassStatus(
    id: string,
    status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  ): Observable<ZoomClassResponse> {
    return this.http.patch<ZoomClassResponse>(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }

  /**
   * Update all class statuses (Admin only)
   */
  updateAllStatuses(): Observable<ZoomClassResponse> {
    return this.http.post<ZoomClassResponse>(
      `${this.apiUrl}/update-statuses`,
      {}
    );
  }

  /**
   * Get live Zoom classes with polling (updates every 30 seconds)
   */
  getLiveZoomClassesWithPolling(
    intervalMs: number = 30000
  ): Observable<ZoomClassResponse> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getLiveZoomClasses())
    );
  }
}
