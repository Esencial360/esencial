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

  @Input() blogSelected!: string;

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

  fetchBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => { this.blogs = blogs; },
      error: (error) => { console.error('Error fetching blogs:', error); },
    });
  }

  fetchCategories() {
    this.blogService.getAllCategories().subscribe({
      next: (categories: Category[]) => { this.categories = categories; },
      error: (error) => { console.error('Error fetching categories:', error); },
    });
  }

  calculateReadingStats(html: string) {
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    this.wordCount = textContent ? textContent.split(/\s+/).length : 0;
    this.readingTime = Math.max(1, Math.ceil(this.wordCount / 225));
  }

  setDescription(html: string) {
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(html);
    this.calculateReadingStats(html);
  }

  onNavigateToBlog(id: string) {
    this.router.navigate([`/blog/${id}`]).catch((error) => {
      console.error(`Navigation error: ${error.message}`);
    });
  }

  loadImage() {
    const apiUrl = `/api/uploadFile/${this.imageId}`;
    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      },
      error: (error) => { console.error('Error loading image:', error); },
    });
  }

  scrollArrow() {
    const element = document.getElementById('scrollContent');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  /** Returns Blog objects belonging to this category — replaces triple nested @for */
  getBlogsForCategory(category: Category): Blog[] {
    if (!category.blogs?.length || !this.blogs?.length) return [];
    return (category.blogs as string[])
      .map(id => this.blogs.find(b => b._id === id))
      .filter((b): b is Blog => !!b);
  }

  /** Strips TinyMCE HTML tags so card excerpts show plain text */
  stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '').trim() ?? '';
  }
}