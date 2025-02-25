import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-classes',
  templateUrl: './favorite-classes.component.html',
  styleUrl: './favorite-classes.component.css',
})
export class FavoriteClassesComponent implements OnInit {
  @Input()
  favoriteClasses!: any[];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log(this.favoriteClasses);
  }

  onWatchSingleClass(id: string) {
    this.router
      .navigate([`/collection/`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to class successful');
        } else {
          console.error('Navigation to class failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }
}
