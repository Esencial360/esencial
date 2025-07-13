import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BunnyCollectionsService {
  private baseUrl = `${environment.apiUrl}bunny-collections`;

  constructor(private http: HttpClient) {}

  getCollections() {
    return this.http.get<any[]>(this.baseUrl);
  }

  createCollection(name: string) {
    return this.http.post(this.baseUrl, { name });
  }

  deleteCollection(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
