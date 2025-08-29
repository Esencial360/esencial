import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Blog } from '../Models/Blog';
import { Category } from '../Models/Category';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrlBlogs = `${environment.apiUrl}blog`;
  private apiUrlCategories = `${environment.apiUrl}categories`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrlBlogs);
  }

  getBlog(id: string): Observable<Blog> {
    const url = `${this.apiUrlBlogs}/${id}`;
    return this.http.get<Blog>(url);
  }

  createBlog(blog: FormData): Observable<Blog> {
      return this.auth.getAccessTokenSilently().pipe(
          switchMap((token: string) => {
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`,
            });
            return this.http.post<Blog>(`${this.apiUrlBlogs}`, blog, {
              headers,
            });
          })
        );
  }

  updateBlog(blog: Blog): Observable<Blog> {
    const url = `${this.apiUrlBlogs}/${blog._id}`;
    return this.http.put<Blog>(url, blog);
  }

  deleteBlog(id: string): Observable<any> {
    const url = `${this.apiUrlBlogs}/${id}`;
    return this.http.delete(url);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrlCategories);
  }
}
