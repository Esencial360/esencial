import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NewsService } from '../../../shared/services/news.service';
import { Category } from '../../../shared/Models/Category';
import { News } from '../../../shared/Models/News';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {

  news: News[] = [];
  categories: Category[] = [];
  imageId = '363849589bd5e9ef22f015490ee80ac1'; // Example ID from MongoDB
  safeImageUrl: SafeUrl = '';

  @Input()
  blogSelected!: string;

  constructor(
    private router: Router,
    private newsService: NewsService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fetchBlogs();
    // this.fetchCategories();
    this.loadImage();
  }

  async fetchBlogs() {
    await this.newsService.getAllNews().subscribe(
      (news: News[]) => {
        this.news = news;
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  onNavigateToNews(id: string) {
    this.router
      .navigate([`/noticias/${id}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log(`Navigation to blog ${id} successful`);
        } else {
          console.error(`Navigation to blog ${id} failed`);
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }

  loadImage() {
    const apiUrl = `/api/uploadFile/${this.imageId}`; // Use your uploadFile endpoint

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        console.log(this.safeImageUrl)
      },
      error: (error) => {
        console.error('Error loading image:', error);
        // Handle errors gracefully (e.g., display an error message)
      },
    });
  }

}
