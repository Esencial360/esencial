import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-v2',
  templateUrl: './button-v2.component.html',
  styleUrl: './button-v2.component.css',
})
export class ButtonV2Component {
  @Input() text!: string;

  @Output() onClickAction = new EventEmitter<void>();

  onClick() {
    this.onClickAction.emit();
  }
}
