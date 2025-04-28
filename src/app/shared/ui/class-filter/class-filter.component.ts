import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllInstructors } from '../../../state/instructor.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class-filter',
  templateUrl: './class-filter.component.html',
  styleUrl: './class-filter.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state(
        'closed',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('closed <=> open', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ClassFilterComponent implements OnInit {
  @Input() videos: any[] = [];
  @Output() filtersChanged = new EventEmitter<any[]>();

  instructors$: Observable<any>;
  instructors: any[] = [];

  selectedDifficulty: string | null = null;
  selectedSubcategory: string | null = null;
  selectedInstructorId: string | null = null;

  constructor(private store: Store) {
    this.instructors$ = this.store.select(selectAllInstructors);
    this.instructors$.subscribe((instructors: any) => {
      this.instructors = instructors;
    });
  }

  ngOnInit() {
    this.filtersChanged.emit(this.videos);
  }

  onFilterChange() {
    let filtered = [...this.videos];

    if (this.selectedDifficulty) {
      filtered = filtered.filter(
        (v) => v.difficulty === this.selectedDifficulty
      );
    }

    if (this.selectedSubcategory) {
      filtered = filtered.filter(
        (v) => v.subcategory === this.selectedSubcategory
      );
    }

    if (this.selectedInstructorId) {
      filtered = filtered.filter(
        (v) => v.instructorId === this.selectedInstructorId
      );
    }

    this.filtersChanged.emit(filtered);
  }

  get uniqueDifficulties() {
    return [...new Set(this.videos.map((v) => v.difficulty))];
  }

  get uniqueSubcategories() {
    return [...new Set(this.videos.map((v) => v.subcategory))];
  }

  get uniqueInstructors() {
    const instructorIds = [...new Set(this.videos.map((v) => v.instructorId))];
    return instructorIds.map((id) => {
      const instructor = this.instructors.find((i) => i._id === id);
      return {
        id: id,
        name: instructor
          ? instructor.firstname + ' ' + instructor.lastname
          : 'Unknown',
      };
    });
  }

  resetFilters() {
    this.selectedDifficulty = '';
    this.selectedSubcategory = '';
    this.selectedInstructorId = '';
    this.onFilterChange(); // Reset to show all
  }
}
