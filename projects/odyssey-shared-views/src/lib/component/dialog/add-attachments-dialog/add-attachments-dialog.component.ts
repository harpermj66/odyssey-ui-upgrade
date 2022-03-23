import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AttachmentModel} from "../../../model/attachment.model";
import {UnsavedChangesDialogComponent} from "../unsaved-changes-dialog/unsaved-changes-dialog.component";
import {RemoveExtensionPipe} from "../../../pipes/remove-extension.pipe";

export class AttachmentSelectedModel extends AttachmentModel {
  originalFileName?: string;
}

@Component({
  selector: 'lib-add-attachments-dialog',
  templateUrl: './add-attachments-dialog.component.html',
  styleUrls: ['./add-attachments-dialog.component.css']
})
export class AddAttachmentsDialogComponent {

  attachments: AttachmentSelectedModel[] = [];

  validationIssues: {[fileName: string]: {[field: string]: string}} = {};

  constructor(public dialogRef: MatDialogRef<AddAttachmentsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                attachments: AttachmentModel[]
              },
              private dialog: MatDialog) {

    if(this.data) {
      if(this.data.attachments) {
        this.attachments = this.data.attachments;
      }
    }

    this.dialogRef.disableClose = true;
  }

  isValid(): boolean {
    let hasIssues = false;
    this.validationIssues = {};

    this.attachments.forEach(attachment => {
      if(!attachment.description || attachment.description.trim().length === 0) {
        hasIssues = true;
        if(!this.validationIssues[attachment.file.name]) {
          this.validationIssues[attachment.file.name] = {};
        }
        this.validationIssues[attachment.file.name].description = 'Description cannot be blank';
      }

      if(!attachment.fileName || attachment.fileName.trim().length === 0) {
        hasIssues = true;
        if(!this.validationIssues[attachment.file.name]) {
          this.validationIssues[attachment.file.name] = {};
        }
        this.validationIssues[attachment.file.name].fileName = 'File name cannot be blank';
      }

      if(!attachment.name || attachment.name.trim().length === 0) {
        hasIssues = true;
        if(!this.validationIssues[attachment.file.name]) {
          this.validationIssues[attachment.file.name] = {};
        }
        this.validationIssues[attachment.file.name].name = 'Name cannot be blank';
      }
    });

    return !hasIssues;
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.attachments);
  }

  onCancelClick(): void {
    this.dialog.open(UnsavedChangesDialogComponent, {
      data: {
        entityTypeName: "Job"
      }
    }).afterClosed().subscribe(shouldClose => {
      if(shouldClose) {
        this.dialogRef.close();
      }
    });
  }

  onFilesSelected(files: FileList | null): void {

    this.attachments = [];

    if(files) {
      for(let i = 0; i < files.length; i++) {
        const file = files.item(i);

        if(file) {
          const attachment = new AttachmentSelectedModel();
          attachment.name = RemoveExtensionPipe.removeExtension(file.name);
          attachment.fileName = file.name;
          attachment.originalFileName = file.name;
          attachment.contentType = file.type;
          attachment.size = file.size;
          attachment.file = file;
          attachment.extension = RemoveExtensionPipe.getExtension(file.name);

          this.attachments.push(attachment);
        }
      }
    }
  }

  onSetFileName(attachment: AttachmentModel, fileNameNoExtension?: string): void {
    if(!fileNameNoExtension) {
      fileNameNoExtension = '';
    }

    attachment.fileName = fileNameNoExtension + attachment.extension;
  }
}
