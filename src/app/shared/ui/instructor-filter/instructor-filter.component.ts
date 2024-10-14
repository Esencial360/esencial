import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-instructor-filter',
  templateUrl: './instructor-filter.component.html',
  styleUrl: './instructor-filter.component.css'
})
export class InstructorFilterComponent {

  @Output() filterChange = new EventEmitter<string>();

  filters: string[] = ['Most Popular', 'Newest', 'A-Z'];
  activeFilter: string = this.filters[0]; 
  dropdownClosed: boolean = true;

  applyFilter(filter: string) {
    this.activeFilter = filter;
    this.filterChange.emit(filter);
    
  }

  toggleDropdown() {
    this.dropdownClosed = !this.dropdownClosed;
  }

}
