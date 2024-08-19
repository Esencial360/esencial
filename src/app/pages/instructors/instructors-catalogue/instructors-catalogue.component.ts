import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorService } from '../../../shared/services/instructor.service';
import AOS from 'aos';

interface PreviewInstructor {
  _id: number;
  name: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-instructors-catalogue',
  templateUrl: './instructors-catalogue.component.html',
  styleUrl: './instructors-catalogue.component.css',
})
export class InstructorsCatalogueComponent implements OnInit, OnDestroy {
  instructors: any;
  filteredInstructors: PreviewInstructor[] = [];

  constructor(
    private router: Router,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0); 
    this.getAllInstructors();
    AOS.init({ once: true });
  }

  getAllInstructors() {
    this.instructorService.getAllInstructors().subscribe(
      (instructors) => {
        this.instructors = instructors;
        console.log(this.instructors);
        this.filteredInstructors = this.instructors;
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
  }

  onFilterChange(filter: string) {
    switch (filter) {
      case 'Most Popular':
        // Sort by popularity (you'll need to define the logic here)
        break;
      case 'Newest':
        // Sort by newest (you'll need to define the logic here)
        break;
      case 'A-Z':
        this.filteredInstructors = [...this.instructors].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
    }
  }

  onInstructor(id: number) {
    this.router.navigate([`/instructores/${id}`]);
    console.log('navigate');
  }
  ngOnDestroy() {
    console.log('InstructorsCatalogueComponent destroyed');
  }
}
