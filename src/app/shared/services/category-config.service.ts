import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryConfig } from '../Models/CategoryConfig';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryConfigService {
  private baseUrl = `${environment.apiUrl}category-config`;
  constructor(private http: HttpClient) {}

  getCategoryConfigs() {
    return this.http.get<CategoryConfig[]>(`${this.baseUrl}`);
  }

  saveCategoryConfig(config: CategoryConfig) {
    return this.http.post(`${this.baseUrl}`, config);
  }

  deleteCategoryConfig(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteSubcategory(collectionId: string, sub: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${collectionId}/subcategory/${sub}`);
}
}
