import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
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
  // Keep all @Inputs so existing <app-dialog [message]="..." /> usages still work
  @Input() isOpen: boolean = false;
  @Input() title!: string;
  @Input() message!: string;
  @Input() cancelText!: string;
  @Input() confirmText!: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  /** True when this component was opened via MatDialog.open() */
  get isMatDialog(): boolean {
    return !!this.data;
  }

  constructor(
    @Optional() public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    // When opened via MatDialog.open(), copy injected data into local properties
    if (this.data) {
      this.title = this.data.title;
      this.message = this.data.message;
      if (this.data.confirmText) this.confirmText = this.data.confirmText;
      if (this.data.cancelText) this.cancelText = this.data.cancelText;
      // Do NOT set isOpen — MatDialog mode uses isMatDialog branch in the template
    }
  }

  confirm() {
    if (this.data?.onConfirm) {
      this.data.onConfirm();
    }
    if (this.dialogRef) {
      this.dialogRef.close(true);
    }
    this.confirmed.emit();
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
    this.close.emit();
  }
}