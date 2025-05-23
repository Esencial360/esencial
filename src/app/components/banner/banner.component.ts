import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import AOS from "aos";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {
  pullZone = environment.pullZone

  @Output()
  onSingleCollection = new EventEmitter<string>()

  @Output()
  onActionButton = new EventEmitter<boolean>()
  
  @Input()
  title!: string;

  @Input()
  description!: string;

  @Input()
  image!: string;


  @Input()
  category!: any; 

  @Input()
  index!: number

  @Input()
  addMargin!: boolean;

  @Input()
  contact!: boolean;

  @Input()
  buttonText!: string


  constructor() {}

  ngOnInit() {
    AOS.init({once: true});
  }

  onHandleCollection(categoryName: string) {
    this.onSingleCollection.emit(categoryName)
  }

  onAction() {
    this.onActionButton.emit(true)
  }
}
