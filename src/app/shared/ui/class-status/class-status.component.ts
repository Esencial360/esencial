import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-class-status',
  templateUrl: './class-status.component.html',
  styleUrl: './class-status.component.css',
})
export class ClassStatusComponent {
  @Input() pendingVideos: number = 0;
  @Input() approvedVideos: number = 0;
}
