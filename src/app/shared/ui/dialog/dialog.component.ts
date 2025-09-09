import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Input() title!: string;
  @Input() message!: string;
  @Input() cancelText!: string;
  @Input() confirmText!: string;

  constructor() {}

  ngOnInit() {
    // You can initialize any data here if needed
  }

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.close.emit();
  }
}
