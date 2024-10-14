import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popular-classes-and-instructors',
  templateUrl: './popular-classes-and-instructors.component.html',
  styleUrl: './popular-classes-and-instructors.component.css'
})
export class PopularClassesAndInstructorsComponent implements OnInit {

  classes!: any[]
  instructors!: any[]

  ngOnInit() {
    this.classes = [
      {
        name: 'Clase 1',
        description: 'Lorem impsum',
        instructor: 'John Smith',
        duration: 500,
        difficulty: 'Beginner'
      },
      {
        name: 'Clase 2',
        description: 'Lorem impsum',
        instructor: 'John Smith',
        duration: 500,
        difficulty: 'Beginner'
      },
      {
        name: 'Clase 3',
        description: 'Lorem impsum',
        instructor: 'John Smith',
        duration: 500,
        difficulty: 'Beginner'
      },
    ]

    this.instructors = [
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
      {
        name: 'John Smith',
        title: 'Yoga Master',
      },
    ]
  }

}
