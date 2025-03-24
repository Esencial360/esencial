import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

interface Class {
  name: string,
  instructor: string,
  category: string,
  difficulty: string,
}

@Component({
  selector: 'app-class-thumbnail',
  templateUrl: './class-thumbnail.component.html',
  styleUrl: './class-thumbnail.component.css'
})
export class ClassThumbnailComponent implements OnInit, OnChanges {

  @Input()
  img!: string;

  @Input()
  classes!: any[] 

  @Input()
  classesIds!: string[]

  @Input()
  allClasses!: boolean

  @Output()
  actionClassSelected = new EventEmitter<string>()

  ngOnInit() {    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classes']) {
      console.log('classes changed:', this.classes);
    }
  }

  onClassSelected($event: string) {
    this.actionClassSelected.emit($event)
  }

}
