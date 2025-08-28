import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/Models/Blog';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrl: './single-blog.component.css',
})
export class SingleBlogComponent implements OnInit {
  blog: Blog | undefined;
  safeDescription!: SafeHtml;
  isLoading = true;
  hasError = false;
  readingTime = 0;
  wordCount = 0;
  isLiked = false;
  likesCount = 0;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.getBlogById();
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  setDescription(html: string) {
    // Sanitize the HTML content from TinyMCE
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(html);
    this.calculateReadingStats(html);
  }

  calculateReadingStats(html: string) {
    // Extract text content from HTML
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    
    // Calculate word count
    this.wordCount = textContent ? textContent.split(/\s+/).length : 0;
    
    // Calculate reading time (average reading speed: 200-250 words per minute)
    this.readingTime = Math.max(1, Math.ceil(this.wordCount / 225));
  }

  getBlogById() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.isLoading = true;
      this.hasError = false;
      
      this.blogService.getBlog(blogId).subscribe(
        (blog: Blog) => {
          this.blog = blog;
          this.setDescription(blog.description);
          
          // Simulate likes count (you can get this from your API)
          this.likesCount = Math.floor(Math.random() * 100) + 10;
          
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching blog:', error);
          this.hasError = true;
          this.isLoading = false;
        }
      );
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    this.likesCount += this.isLiked ? 1 : -1;
    
    // Here you can call your API to save the like
    // this.blogService.toggleLike(this.blog?.id, this.isLiked).subscribe();
  }

  shareArticle() {
    if (navigator.share && this.blog) {
      navigator.share({
        title: this.blog.title,
        text: this.extractTextFromHtml(this.blog.description).substring(0, 100) + '...',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // You can show a toast notification here
        console.log('URL copied to clipboard');
      });
    }
  }

  private extractTextFromHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  printArticle() {
    window.print();
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCategoryIcon(categoryName: string): string {
    // Return appropriate icon based on category
    const iconMap: { [key: string]: string } = {
      'bienestar': 'spa',
      'nutricion': 'restaurant',
      'ejercicio': 'fitness_center',
      'salud': 'favorite',
      'mindfulness': 'self_improvement',
      'default': 'article'
    };
    
    return iconMap[categoryName?.toLowerCase()] || iconMap['default'];
  }
}