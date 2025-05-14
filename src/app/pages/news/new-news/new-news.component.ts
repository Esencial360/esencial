import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../shared/Models/Category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../../../shared/services/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-news',
  templateUrl: './new-news.component.html',
  styleUrl: './new-news.component.css'
})
export class NewNewsComponent implements OnInit {

  categories: Category[] = [];
  newsForm!: FormGroup;

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
    });
  }
  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      console.log(this.newsForm.value);
      this.newsService.createNews(this.newsForm.value).subscribe(
        (response) => {
          console.log('File uploaded successfully:');
          this.router.navigate([`/noticias/${response._id}`])
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

}
