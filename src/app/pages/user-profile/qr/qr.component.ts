import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Instructor } from '../../../shared/Models/Instructor';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css',
})
export class QrComponent implements OnInit {
  @Input() instructor!: Instructor;

  ngOnInit() {
    console.log(this.instructor);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['instructor']) {
      console.log(this.instructor);
    }
  }
}
