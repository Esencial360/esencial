import { Component, OnInit } from '@angular/core';
import { News } from '../../../shared/Models/News';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NewsService } from '../../../shared/services/news.service';

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrl: './single-news.component.css'
})
export class SingleNewsComponent implements OnInit {

  news: News | undefined;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getBlogById();
  }

  goBack() {
    // this.location.back()
  }

  getBlogById() {
    const newsId = this.route.snapshot.paramMap.get('id');
    if (newsId) {
      this.newsService.getNews(newsId).subscribe(
        (news: News) => {
          this.news = news;
        },
        (error) => {
          console.error('Error fetching blog:', error);
        }
      );
    }
  }

}
