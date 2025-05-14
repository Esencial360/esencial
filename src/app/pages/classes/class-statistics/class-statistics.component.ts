import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnystreamService } from '../../../shared/services/bunny-stream.service';

@Component({
  selector: 'app-class-statistics',
  templateUrl: './class-statistics.component.html',
  styleUrl: './class-statistics.component.css',
})
export class ClassStatisticsComponent implements OnInit {
  videoId!: any;

  videos!: any;
  link!: SafeResourceUrl;
  videoStatistics!: any;
  filteredKeys = ['countryViewCounts', 'countryWatchTime'];

  @Input()
  previewView!: boolean;

  @Input()
  videoGuid!: string;

  @Input()
  adminView!: boolean;

  constructor(
    private route: ActivatedRoute,
    private bunnystreamService: BunnystreamService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.getVideoStatistics();
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getValues(obj: any): any[] {
    return Object.values(obj);
  }

  getEntries(obj: any): [string, any][] {
    return Object.entries(obj);
  }

  getVideoStatistics() {
    this.bunnystreamService.getVideoStatistics(this.videoGuid).subscribe(
      (response: any) => {
        this.videoStatistics = response;
      },
      (error) => {
        console.error('Error retrieving videos:', error);
      }
    );
  }

  getTotalViews() {
    const viewCounts = this.videoStatistics?.countryViewCounts || {};
    return Object.values(viewCounts).reduce(
      (acc: any, val) => acc + val,
      0
    );
  }

  getTotalWatchTime() {
    const watchTimeCounts = this.videoStatistics?.countryWatchTime || {};
    return Object.values(watchTimeCounts).reduce(
      (acc: any, val) => acc + val,
      0
    );
  }
}
