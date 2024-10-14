import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-previous-classes',
  templateUrl: './previous-classes.component.html',
  styleUrl: './previous-classes.component.css'
})
export class PreviousClassesComponent {

  @Input()
  previousClasses!: any[]

}
