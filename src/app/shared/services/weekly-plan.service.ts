import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WeeklyPlan {
  day: string;
  type: 'clase' | 'meditacion';
  category: string;
  subcategory: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeeklyPlanService {

    private baseUrl = `${environment.apiUrl}weekly-plan`;

  constructor(private http: HttpClient) {}

  saveConfig(config: WeeklyPlan): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.baseUrl, config);
  }

  getConfigs(): Observable<WeeklyPlan[]> {
    return this.http.get<WeeklyPlan[]>(this.baseUrl);
  }
}
