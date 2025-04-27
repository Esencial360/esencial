import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstructorService } from '../../../shared/services/instructor.service';
import AOS from 'aos';
import { catchError, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  pullZone = environment.pullZone
  private destroy$ = new Subject<void>();

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
    this.instructorService.getAllInstructors()
      .pipe(
        takeUntil(this.destroy$),
        tap((instructors) => {
          this.instructors = instructors;
        }),
        catchError((error) => {
          console.error('Error fetching instructors:', error);
          return [];
        })
      )
      .subscribe();
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

  onInstructor(id: string) {
    this.router.navigate([`/instructores/${id}`]);
    console.log('navigate');
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  scrollArrow() {
    const element = document.getElementById('scrollContent')
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    } 
  }
}
