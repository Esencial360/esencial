import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite-classes',
  templateUrl: './favorite-classes.component.html',
  styleUrl: './favorite-classes.component.css'
})
export class FavoriteClassesComponent implements OnInit {

  @Input()
  favoriteClasses!: any[]

  ngOnInit(){}

}
