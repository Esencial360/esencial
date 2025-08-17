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
  selectedFileNewBlog!: any;

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [null],
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
    console.log(this.blogForm);
    
    if (this.blogForm.valid) {
      const formData = new FormData();

      formData.append('title', this.blogForm.value.title);
      formData.append('description', this.blogForm.value.description);
      formData.append('categoryId', this.blogForm.value.categoryId);
      formData.append('imageUrl', this.selectedFileNewBlog);
      this.blogService.createBlog(formData).subscribe(
        (response) => {
          console.log('File uploaded successfully:');
          this.firstStep = false;
          this.secondStep = true;
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
    this.firstStep = true
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onProcessDone() {
    this.router.navigate(['/home']);
  }

    onFileSelectedNewInstructor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFileNewBlog = target.files[0];
    }
    console.log(this.selectedFileNewBlog);
    
  }
}
