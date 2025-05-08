import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllInstructors } from '../../../state/instructor.selector';
import { Observable, take } from 'rxjs';

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
export class ClassFilterComponent implements OnInit, OnChanges {
  @Input() videos: any[] = [];
  @Output() filtersChanged = new EventEmitter<any[]>();

  instructors$: Observable<any>;
  instructors: any[] = [];

  filteredVideos: any[] = [];

  selectedDifficulty: string | null = null;
  selectedSubcategory: string | null = null;
  selectedInstructorId: string | null = null;

  uniqueDifficulties: string[] = [];
  uniqueSubcategories: string[] = [];
  uniqueInstructors: { id: string; name: string }[] = [];

  constructor(private store: Store) {
    this.instructors$ = this.store.select(selectAllInstructors);
  }

  ngOnInit() {
    this.instructors$.pipe(take(1)).subscribe((instructors: any) => {
      this.instructors = instructors;
      this.buildUniqueInstructors();
    });
  }

  ngOnChanges() {
    this.buildFilterOptions();
    this.applyFilters();
  }

  buildFilterOptions() {
    this.uniqueDifficulties = [...new Set(this.videos.map((v) => v.difficulty))];
    this.uniqueSubcategories = [...new Set(this.videos.map((v) => v.subcategory))];
    this.buildUniqueInstructors();
  }

  buildUniqueInstructors() {
    const instructorIds = [...new Set(this.videos.map((v) => v.instructorId))];
    this.uniqueInstructors = instructorIds.map((id) => {
      const instructor = this.instructors.find((i) => i._id === id);
      return {
        id,
        name: instructor ? `${instructor.firstname} ${instructor.lastname}` : 'Unknown',
      };
    });
  }

  applyFilters() {
    let filtered = [...this.videos];

    if (this.selectedDifficulty) {
      filtered = filtered.filter((v) => v.difficulty === this.selectedDifficulty);
    }

    if (this.selectedSubcategory) {
      filtered = filtered.filter((v) => v.subcategory === this.selectedSubcategory);
    }

    if (this.selectedInstructorId) {
      filtered = filtered.filter((v) => v.instructorId === this.selectedInstructorId);
    }

    this.filteredVideos = filtered;
    this.filtersChanged.emit(this.filteredVideos);
  }

  onFilterChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.selectedDifficulty = '';
    this.selectedSubcategory = '';
    this.selectedInstructorId = '';
    this.applyFilters();
  }
}

