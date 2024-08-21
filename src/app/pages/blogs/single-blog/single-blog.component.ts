import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/Models/Blog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrl: './single-blog.component.css',
})
export class SingleBlogComponent implements OnInit {
  blog: Blog | undefined;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getBlogById();
  }

  goBack() {
    this.location.back()
  }

  getBlogById() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.blogService.getBlog(blogId).subscribe(
        (blog: Blog) => {
          this.blog = blog;
        },
        (error) => {
          console.error('Error fetching blog:', error);
        }
      );
    }
  }
}
