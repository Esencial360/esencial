import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.css',
})
export class DialogPopupComponent {

  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  closeDialog() {
    this.close.emit();
  }

  confirm() {
    this.confirmed.emit(); 
    this.closeDialog();
  }
}
