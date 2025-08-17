import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../Models/Blog';
import { Category } from '../Models/Category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrlBlogs = `${environment.apiUrl}blog`;
  private apiUrlCategories = `${environment.apiUrl}categories`;

  constructor(private http: HttpClient) {}

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrlBlogs);
  }

  getBlog(id: string): Observable<Blog> {
    const url = `${this.apiUrlBlogs}/${id}`;
    return this.http.get<Blog>(url);
  }

  createBlog(blog: FormData): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrlBlogs, blog);
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
