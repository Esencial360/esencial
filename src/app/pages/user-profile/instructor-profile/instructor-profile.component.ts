import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrl: './instructor-profile.component.css',
})
export class InstructorProfileComponent implements OnInit {
  @Input() filters!: string[];

  videos!: any[];
  payments = [
    {
      month: 'MAYO',
      amount: 459.32,
    },
    {
      month: 'JUNIO',
      amount: 459.32,
    },
    {
      month: 'JULIO',
      amount: 459.32,
    },
  ];

  constructor(
    private router: Router,
    private bunnyStreamService: BunnystreamService
  ) {}

  ngOnInit(): void {
    // this.setFilters();
    console.log('init inst');
  }

  // onShowTab(tabName: string) {
  //   this.filterAction.emit(tabName);
  // }

  showTab(tabName: string): boolean {
    return this.filters.includes(tabName);
  }

  onUploadVideo() {
    this.router.navigateByUrl('/nuevo-video');
  }

  onWatchSingleClass(video: any) {
    const collectionName = this.bunnyStreamService.getCollection(
      video.collectionId
    );
    this.router
      .navigate([`/collection/${collectionName}/${video.guid}`])
      .then((navigationSuccess) => {
        if (navigationSuccess) {
          console.log('Navigation to class successful');
        } else {
          console.error('Navigation to class failed');
        }
      })
      .catch((error) => {
        console.error(`An error occurred during navigation: ${error.message}`);
      });
  }
}
