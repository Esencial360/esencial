import { Component } from '@angular/core';

@Component({
  selector: 'app-class-filter',
  templateUrl: './class-filter.component.html',
  styleUrl: './class-filter.component.css'
})
export class ClassFilterComponent {
  dropdowns = {
    difficulty: false,
    length: false,
    instructors: false
  };

  difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  lengthOptions = ['0-15 min', '15-30 min', '30-45 min', '45+ min'];
  instructors = [
    'Abiola Akanni', 'Action Jacquelyn', 'Adrian Michael Green',
    'Adrienne Everett', 'Adrienne Rabena', 'Ajay James',
    'Andrew Sealy', 'Annie Moves', 'Ashley Galvin'
  ];

  selectedDifficulties: { [key: string]: boolean } = {};
  selectedLengths: { [key: string]: boolean } = {};
  selectedInstructors: { [key: string]: boolean } = {};
  allInstructorsSelected = true;

  constructor() {
    this.difficultyLevels.forEach(level => this.selectedDifficulties[level] = false);
    this.lengthOptions.forEach(option => this.selectedLengths[option] = false);
    this.instructors.forEach(instructor => this.selectedInstructors[instructor] = true);
  }

  toggleDropdown(dropdown: 'difficulty' | 'length' | 'instructors') {
    this.dropdowns[dropdown] = !this.dropdowns[dropdown];
  }

  toggleAllInstructors() {
    for (let instructor of this.instructors) {
      this.selectedInstructors[instructor] = this.allInstructorsSelected;
    }
  }

  updateInstructorSelection() {
    this.allInstructorsSelected = this.instructors.every(instructor => this.selectedInstructors[instructor]);
  }

}
