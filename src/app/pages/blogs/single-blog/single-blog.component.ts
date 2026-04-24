import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/Models/Blog';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrl: './single-blog.component.css',
})
export class SingleBlogComponent implements OnInit, OnDestroy {
  blog: Blog | undefined;
  safeDescription!: SafeHtml;
  isLoading = true;
  hasError = false;
  readingTime = 0;
  wordCount = 0;
  isEditOpen = false;
  canEdit = false;
  isAdmin = false;
  isDeleting = false;
  showDeleteConfirm = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getBlogById();

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        const namespace = 'https://test-assign-roles.com/';
        const roles: string[] = user[`${namespace}roles`] ?? [];
        this.canEdit = roles.includes('Admin') || roles.includes('Instructor');
        this.isAdmin = roles.includes('Admin');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() { this.location.back(); }
  goHome() { this.router.navigate(['/home']); }

  openEditModal() { this.isEditOpen = true; }
  closeEditModal() { this.isEditOpen = false; }

  confirmDelete() { this.showDeleteConfirm = true; }
  cancelDelete() { this.showDeleteConfirm = false; }

  deleteBlog() {
    if (!this.blog?._id) return;
    this.isDeleting = true;
    this.blogService.deleteBlog(this.blog._id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error deleting blog:', err);
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      },
    });
  }

  setDescription(html: string) {
    this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(html);
    this.calculateReadingStats(html);
  }

  calculateReadingStats(html: string) {
    const text = html.replace(/<[^>]*>/g, '').trim();
    this.wordCount = text ? text.split(/\s+/).length : 0;
    this.readingTime = Math.max(1, Math.ceil(this.wordCount / 225));
  }

  getBlogById() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (!blogId) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.hasError = false;
    this.blogService.getBlog(blogId).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
        this.setDescription(blog.description);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching blog:', error);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  shareArticle() {
    if (navigator.share && this.blog) {
      navigator.share({
        title: this.blog.title,
        text: this.extractTextFromHtml(this.blog.description).substring(0, 100) + '...',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => console.log('URL copied'))
        .catch(console.error);
    }
  }

  private extractTextFromHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  printArticle() { window.print(); }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}