import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

export interface LiveClass {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  instructorName: string;
  scheduledTime: Date;
  duration: number;
  youtubeVideoId: string;
  youtubeChannelId: string;
  thumbnailUrl?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  category: string;
  level: string;
  maxParticipants: number;
  currentViewers: number;
  totalViews: number;
  registeredUsers: string[];
  chatEnabled: boolean;
  isRecorded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiveClassService {
  private apiUrl = `${environment.apiUrl}live-classes`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Obtener todas las clases con filtros opcionales
getAllClasses(filters?: {
  status?: string;
  category?: string;
  level?: string;
  instructor?: string;
}): Observable<ApiResponse<LiveClass[]>> {
  let params = new HttpParams();

  if (filters) {
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof typeof filters];
      if (value) {
        params = params.set(key, value);
      }
    });
  }

  return this.auth.getAccessTokenSilently().pipe(
    switchMap((token: string) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // ✅ Corrected: headers and params go in the same options object
      return this.http.get<ApiResponse<LiveClass[]>>(this.apiUrl, {
        headers,
        params,
      });
    })
  );
}


  // Obtener clases en vivo actualmente
  getLiveClasses(): Observable<ApiResponse<LiveClass[]>> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<ApiResponse<LiveClass[]>>(`${this.apiUrl}/live`, {
          headers,
        });
      })
    );
  }

  // Obtener clases próximas
  getUpcomingClasses(): Observable<ApiResponse<LiveClass[]>> {
    return this.http.get<ApiResponse<LiveClass[]>>(`${this.apiUrl}/upcoming`);
  }

  // Obtener una clase específica por ID
  getClassById(id: string): Observable<ApiResponse<LiveClass>> {
    return this.http.get<ApiResponse<LiveClass>>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva clase
  createClass(
    classData: Partial<LiveClass>
  ): Observable<ApiResponse<LiveClass>> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post<ApiResponse<LiveClass>>(this.apiUrl, classData, {
          headers,
        });
      })
    );
  }

  // Actualizar el estado de una clase
  updateClassStatus(
    id: string,
    status: string
  ): Observable<ApiResponse<LiveClass>> {
    return this.http.patch<ApiResponse<LiveClass>>(
      `${this.apiUrl}/${id}/status`,
      { status }
    );
  }

  updateClass(
    id: string,
    classData: Partial<LiveClass>
  ): Observable<ApiResponse<LiveClass>> {
    return this.http.put<ApiResponse<LiveClass>>(
      `${this.apiUrl}/${id}`,
      classData
    );
  }

  // Registrar usuario a una clase
  registerToClass(
    classId: string,
    userId: string
  ): Observable<ApiResponse<LiveClass>> {
    return this.http.post<ApiResponse<LiveClass>>(
      `${this.apiUrl}/${classId}/register`,
      { userId }
    );
  }

  // Verificar estado de YouTube
  getYouTubeStatus(classId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/${classId}/youtube-status`
    );
  }

  // Eliminar una clase
  deleteClass(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Polling automático para clases en vivo (actualiza cada 30 segundos)
  getLiveClassesWithPolling(
    intervalMs: number = 30000
  ): Observable<ApiResponse<LiveClass[]>> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getLiveClasses())
    );
  }

  // Calcular tiempo restante hasta el inicio
  getTimeUntilStart(scheduledTime: Date): number {
    const now = new Date().getTime();
    const start = new Date(scheduledTime).getTime();
    return Math.max(0, start - now);
  }

  // Verificar si la clase está en vivo ahora
  isCurrentlyLive(liveClass: LiveClass): boolean {
    const now = new Date().getTime();
    const start = new Date(liveClass.scheduledTime).getTime();
    const end = start + liveClass.duration * 60 * 1000;
    return liveClass.status === 'live' || (now >= start && now <= end);
  }

  // Obtener URL del embed de YouTube
  getYouTubeEmbedUrl(videoId: string, autoplay: boolean = true): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${
      autoplay ? 1 : 0
    }&modestbranding=1&rel=0`;
  }

  // Obtener URL del thumbnail de YouTube
  getYouTubeThumbnail(
    videoId: string,
    quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'
  ): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
}
