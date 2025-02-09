import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikedClassesService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  toggleVideoLike(videoId: string, userId: string): Observable<any> {
    console.log(videoId, userId);
    
    return this.http.post(`${this.apiUrl}/like-video`, { videoId, userId });
  }

  getLikedVideos(userId: string): Observable<string[]> {
    console.log('userid' ,userId);
    
    return this.http.get<string[]>(`${this.apiUrl}/liked-videos/${userId}`);
  }
}
