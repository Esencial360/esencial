import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/Models/Blog';
import { Category } from '../../../shared/Models/Category';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Article {
  image: string;
  author: string;
  date: string;
  title: string;
  description: string;
  tag: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit {
  pullZone = environment.pullZone;
  blogs: Blog[] = [];
  categories: Category[] = [];
  readingTime = 0;
   wordCount = 0;
  imageId = '363849589bd5e9ef22f015490ee80ac1'; 
  safeImageUrl: SafeUrl = '';
  safeDescription!: SafeHtml;

  @Input()
  blogSelected!: string;

  constructor(
    private router: Router,
    private blogService: BlogService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.fetchBlogs();
    this.fetchCategories();
    this.loadImage();
  }

  async fetchBlogs() {
    await this.blogService.getAllBlogs().subscribe(
      (blogs: Blog[]) => {
        this.blogs = blogs;
      },
      (error) => {
        console.error('Error fetching blogs:', error);
      }
    );
  }

  async fetchCategories() {
    await this.blogService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

    calculateReadingStats(html: string) {
    // Extract text content from HTML
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    
    // Calculate word count
    this.wordCount = textContent ? textContent.split(/\s+/).length : 0;
    
    // Calculate reading time (average reading speed: 200-250 words per minute)
    this.readingTime = Math.max(1, Math.ceil(this.wordCount / 225));
  }

    setDescription(html: string) {
    // Sanitize the HTML content from TinyMCE
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(html);
    this.calculateReadingStats(html);
  }

  onNavigateToBlog(id: string) {
    this.router
      .navigate([`/blog/${id}`])
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
      },
      error: (error) => {
        console.error('Error loading image:', error);
        // Handle errors gracefully (e.g., display an error message)
      },
    });
  }

  scrollArrow() {
    const element = document.getElementById('scrollContent');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

    getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
