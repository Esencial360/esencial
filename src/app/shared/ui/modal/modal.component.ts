import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();


  ngOnInit() {
    document.body.classList.add('overflow-hidden');
  }

  closeModal() {
    document.body.classList.remove('overflow-hidden');
    this.close.emit();
  }
}
