import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../shared/services/blog.service';
import { Category } from '../../../shared/Models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.css',
})
export class NewBlogComponent implements OnInit {
  categories: Category[] = [];
  blogForm!: FormGroup;
  isModalOpen!: boolean;
  firstStep!: boolean;
  secondStep!: boolean;

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [null, Validators.required],
      categoryId: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.blogService.getAllCategories().subscribe(
      (response) => {
        console.log('Categories successfuly fetch');
        this.categories = response;
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      this.blogService.createBlog(this.blogForm.value).subscribe(
        (response) => {
          console.log('File uploaded successfully:');
          this.router.navigate([`/blog/${response._id}`]);
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onProcessDone() {
    this.router.navigate(['/home']);
  }
}
