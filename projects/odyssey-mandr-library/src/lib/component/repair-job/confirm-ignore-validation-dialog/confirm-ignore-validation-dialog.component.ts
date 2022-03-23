import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'lib-confirm-ignore-validation-dialog',
  templateUrl: './confirm-ignore-validation-dialog.component.html',
  styleUrls: ['./confirm-ignore-validation-dialog.component.scss']
})
export class ConfirmIgnoreValidationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmIgnoreValidationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                action: string
                validationIssues: {
                  message: string,
                  field?: string
                }[]
              }) {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
