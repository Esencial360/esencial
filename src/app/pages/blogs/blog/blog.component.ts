import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/Models/Blog';
import { Category } from '../../../shared/Models/Category';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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
  blogs: Blog[] = [];
  categories: Category[] = [];
  imageId = '363849589bd5e9ef22f015490ee80ac1'; // Example ID from MongoDB
  safeImageUrl: SafeUrl = '';
  articles: Article[] = [
    {
      image: 'path/to/yoga-sleep.jpg',
      author: 'Olivia Rhye',
      date: 'Jan 29, 2024',
      title: 'Yoga for sleep: Evening routines for better rest',
      description: 'Breathing plays an essential role in our well-being. Follow the advice of Dr. Marie',
      tag: 'Health'
    },
    {
      image: 'path/to/yoga-styles.jpg',
      author: 'Olivia Rhye',
      date: 'Jan 29, 2024',
      title: 'Exploring the different styles of Yoga',
      description: 'Breathing plays an essential role in our well-being. Follow the advice of Dr. Marie',
      tag: 'Health'
    },
    {
      image: 'path/to/yoga-kids.jpg',
      author: 'Olivia Rhye',
      date: 'Jan 29, 2024',
      title: 'Yoga and mindfulness for kids',
      description: 'Breathing plays an essential role in our well-being. Follow the advice of Dr. Marie',
      tag: 'Health'
    }
  ];

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
}
