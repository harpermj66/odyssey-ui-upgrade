import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogData} from "../model/confirmation-dialog-data";

@Component({
  selector: 'lib-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  confirmClicked = new EventEmitter<void>();

  constructor(
      public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  emitConfirmClicked(): void {
    this.confirmClicked.emit();
    this.dialogRef.close();
  }

  ngOnInit(): void {}

}
