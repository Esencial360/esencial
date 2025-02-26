import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LikedClassesService {
  private apiUrl =  `${environment.apiUrl}users`
  constructor(private http: HttpClient) {}

  toggleVideoLike(videoId: string, userId: string): Observable<any> {
    console.log(videoId, userId);
    
    return this.http.post(`${this.apiUrl}/like-video`, { videoId, userId });
  }

  getLikedVideos(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/liked-videos/${userId}`);
  }
}
