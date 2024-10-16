import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.css',
})
export class DialogPopupComponent {

  @Input()
  isOpen!: boolean;

  @Input()
  badge!: any
  
  @Output()
  onCloseDialog = new EventEmitter<boolean>();

  closeDialog() {
    document.body.classList.remove('overflow-hidden');
    this.isOpen = false;
    this.onCloseDialog.emit(true);
  }
}
