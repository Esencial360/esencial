import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

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
export class ClassThumbnailComponent implements OnInit {

  @Input()
  img!: string;

  @Input()
  classes!: any[] 

  @Output()
  actionClassSelected = new EventEmitter<string>()

  ngOnInit() {
    
  }

  onClassSelected($event: string) {
    this.actionClassSelected.emit($event)
  }

}
