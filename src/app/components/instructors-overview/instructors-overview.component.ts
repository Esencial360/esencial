import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Instructor } from '../../shared/Models/Instructor';
import { InstructorService } from '../../shared/services/instructor.service';
import { InstructorActions } from '../../state/instructor.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-instructors-overview',
  templateUrl: './instructors-overview.component.html',
  styleUrl: './instructors-overview.component.css',
})
export class InstructorsOverviewComponent implements OnInit {

  @Input() adminView!: boolean;

  openModal!: boolean;
  processComplete!: boolean;

  constructor(
    private router: Router,
    private instructorService: InstructorService,
    private store: Store
  ) {}

  instructors: Instructor[] = [];

  ngOnInit() {
    this.getAllInstructors();
  }

  getAllInstructors() {
    this.instructorService.getAllInstructors().subscribe(
      (instructors) => {
        this.instructors = instructors.slice(0, 3);
        this.store.dispatch(
          InstructorActions.retrievedInstructorList({
            instructors: instructors,
          })
        );
      },
      (error) => {
        console.error('Error fetching instructors:', error);
      }
    );
  }

  onInstructor(id: string | undefined) {
    this.router.navigate([`/instructores/${id}`]);
  }

  onAllInstructors() {
    this.router.navigate(['/instructores'])
  }

  onNewInstructor() {
    this.openModal = true;
  }

  onClose() {
    this.openModal = false;
  }
}
