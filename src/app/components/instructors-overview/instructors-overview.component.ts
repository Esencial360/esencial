import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from "aos";

interface Instructor {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-instructors-overview',
  templateUrl: './instructors-overview.component.html',
  styleUrl: './instructors-overview.component.css',
})
export class InstructorsOverviewComponent implements OnInit{

  constructor(private router: Router) {}

  instructors: Instructor[] = [
    { name: 'Ashley Galvin', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Jacy Cunningham', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Emily Sferra', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Josh Kramer', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Briohny Smyth', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Emily Sferra', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Josh Kramer', imageUrl: '../../../assets/images/examplePerson.jpg' },
    { name: 'Briohny Smyth', imageUrl: '../../../assets/images/examplePerson.jpg' },
  ];

  ngOnInit(){
    AOS.init({once: true})
  }

  onSeeAll() {
    this.router
    .navigateByUrl('/instructores')
    .then((navigationSuccess) => {
      if (navigationSuccess) {
        console.log('Navigation to instructores page successful');
      } else {
        console.error('Navigation to instructores page failed');
      }
    })
    .catch((error) => {
      console.error(`An error occurred during navigation: ${error.message}`);
    });
  }

}
