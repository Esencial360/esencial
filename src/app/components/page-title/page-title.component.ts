import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.css',
})
export class PageTitleComponent implements OnInit {
  @Input()
  pageTitle!: string | undefined;

  @Input()
  pageDescription!: string;

  @Input()
  arrowBack!: boolean;

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }
}
