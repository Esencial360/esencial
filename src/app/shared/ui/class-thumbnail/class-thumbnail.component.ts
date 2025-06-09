import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

type VideoSource = 'video' | 'workshop';

@Component({
  selector: 'app-class-thumbnail',
  templateUrl: './class-thumbnail.component.html',
  styleUrl: './class-thumbnail.component.css'
})
export class ClassThumbnailComponent implements OnInit, OnChanges {

  videoSource!: VideoSource

  @Input()
  workshops!: boolean;

  @Input()
  img!: string;

  @Input()
  classes!: any[] 

  @Input()
  classesIds!: string[]

  @Input()
  allClasses!: boolean

  @Input()
  allInfo!: boolean;

  @Input()
  hideStatistics!: boolean;

  @Output()
  actionClassSelected = new EventEmitter<string>()

  ngOnInit() {    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classes']) {
      if (this.workshops) {
        this.videoSource = 'workshop'
      } else {
        this.videoSource = 'video'
      }
    }
  }

  onClassSelected($event: string) {
    this.actionClassSelected.emit($event)
  }

}
