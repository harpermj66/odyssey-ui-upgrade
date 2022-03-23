import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {AttachmentInfoVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/attachment-info-vo.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {AttachmentVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/attachment-vo.model";
import {MatDialog} from "@angular/material/dialog";
import {AddAttachmentsDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/add-attachments-dialog/add-attachments-dialog.component";
import {AttachmentModel} from "../../../../../../odyssey-shared-views/src/lib/model/attachment.model";
import {RepairJobAttachmentService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job-attachment.service";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {PageableModel} from "../../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {PageEvent} from "@angular/material/paginator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {ConfirmDeleteDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {ChangeDetector} from "../../../../../../odyssey-service-library/src/lib/utils/change-detector";
import {RepairJobAttachmentsViewComponent} from "../repair-job-attachment-view/repair-job-attachments-view.component";

@Component({
  selector: 'lib-repair-job-attachments-list',
  templateUrl: './repair-job-attachments-list.component.html',
  styleUrls: ['./repair-job-attachments-list.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class RepairJobAttachmentsListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() repairJobId: number | null;
  @Input() repairJobNumber: string | null;

  @Input() disabled: boolean;
  _readonly: boolean;

  attachmentInfos: AttachmentInfoVoModel[] = [];
  attachmentImages: {[attachmentId: string]: SafeUrl | undefined} = {};

  listRequestQueue = new DiscardingRequestQueue();
  imageLoadingRequestQueue = new RequestQueue();
  actionRequestQueue = new RequestQueue();

  totalElements = 0;
  pageSettings: PageableModel = {
    pageSize: 10,
    pageNumber: 0
  };

  progressMode: ProgressBarMode = "indeterminate";
  progress = 0;

  constructor(private attachmentsService: RepairJobAttachmentService,
              private userService: CurrentUserService,
              private subscriptionManager: SubscriptionsManager,
              private changeDetector: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private sanitizer: DomSanitizer) {
    subscriptionManager.addDestroyable(this.listRequestQueue);
    subscriptionManager.addDestroyable(this.imageLoadingRequestQueue);
    subscriptionManager.addDestroyable(this.actionRequestQueue);
  }

  get readonly(): boolean {
    return this._readonly || !(this.userService.user?.roles.MR_EDITOR || this.userService.user?.roles.MR_APPROVER);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  ngOnInit(): void {
    this.loadAttachments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.repairJobId) {
      this.loadAttachments();
    }
  }

  ngOnDestroy(): void {
    ChangeDetector.destroy(this.changeDetector);
  }

  trackById(index: number, entity: any): any {
    return entity && entity.id ? entity.id : index;
  }

  onPagingChanged(event: PageEvent): void {
    this.pageSettings.pageSize = event.pageSize;
    this.pageSettings.pageNumber = event.pageIndex;
    this.loadAttachments();
  }

  private buildImageUrl(attachment: AttachmentVoModel): SafeUrl | undefined {
    if(attachment.contentType && attachment.contentType.startsWith('image/')) {
      const url = 'data:' + attachment.contentType + ';base64,' + attachment.contents;
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return undefined;
  }

  onAddClick(): void {
    this.dialog.open(AddAttachmentsDialogComponent).afterClosed().subscribe(
      (attachments?: AttachmentModel[]) => {
        if(attachments && attachments.length > 0) {
          this.uploadAttachments(attachments);
        }
      }
    );
  }

  private loadAttachments(): void {
    if(this.repairJobId) {
      this.listRequestQueue.makeRequest(
        this.attachmentsService.getAttachmentInfosForRepairJob(this.repairJobId, this.pageSettings),
        attachmentInfoPage => {
            this.attachmentInfos = [];
            this.totalElements = attachmentInfoPage.totalElements;
            if(attachmentInfoPage.content) {
              this.attachmentInfos = attachmentInfoPage.content;
            }
            this.loadImages();
        }
      );
    }
  }

  private loadImages(): void {
    // Load each of the images in turn.
    this.attachmentInfos.forEach(info => {
      const id = info.id;
      if(id && !this.attachmentImages[id.toString()]) {
        this.imageLoadingRequestQueue.makeRequest(
          this.attachmentsService.getAttachment(id),
          attachment => {
            if(attachment.contents) {
              this.attachmentImages[id.toString()] = this.buildImageUrl(attachment);
            }
          }
        );
      }
    });
  }

  private uploadAttachments(attachments: AttachmentModel[]): void {
    this.progress = 0;
    const repairJobId = this.repairJobId;
    if(repairJobId) {
      const failedUploads: AttachmentModel[] = [];
      const totalUploads = attachments.length;
      let successfulUploads = 0;
      while(attachments.length > 0) {
        const attachment = attachments.pop();

        if(attachment) {
          this.actionRequestQueue.makeRequest(
            () => {
              this.progressMode = "buffer";
              return this.attachmentsService.addAttachmentToRepairJob(repairJobId, attachment);
            },
            info => {
              successfulUploads++;
              this.loadImages();
              this.onUploadPartialComplete(failedUploads, successfulUploads, totalUploads);
              if(attachments.length === 0) {
                this.onUploadsComplete(failedUploads);
              }
            },
            error => {
              failedUploads.push(attachment);
              this.onUploadPartialComplete(failedUploads, successfulUploads, totalUploads);
              if(attachments.length === 0) {
                this.onUploadsComplete(failedUploads);
              }
            }
          );
        }
      }
    }
  }

  private onUploadPartialComplete(failedUploads: AttachmentModel[], successfulUploads: number, totalUploads: number): void {
    this.progress = ((failedUploads.length + successfulUploads)/totalUploads)*100;
    ChangeDetector.detectChanges(this.changeDetector);
  }

  private onUploadsComplete(failedUploads: AttachmentModel[]): void {
    this.progress = 0;

    this.loadAttachments();

    if(failedUploads && failedUploads.length > 0) {
      SnackbarMessage.showErrorMessage(this.snackBar, 'Failed to upload attachment(s)');

      this.dialog.open(AddAttachmentsDialogComponent,{
        data: {
          attachments: failedUploads
        }
      }).afterClosed().subscribe(
        (attachments?: AttachmentModel[]) => {
          if(attachments && attachments.length > 0) {
            this.uploadAttachments(attachments);
          }
        }
      );
    }
  }

  onDeleteClick(attachmentInfo: AttachmentInfoVoModel): void {
    const id = attachmentInfo.id;
    if(id) {
      this.dialog.open(ConfirmDeleteDialogComponent, {
        data: {
          entityTypeName: "Attachment"
        }
      }).afterClosed().subscribe(shouldDelete => {
        if(shouldDelete) {
          this.actionRequestQueue.makeRequest(
            () => {
              this.progressMode = "indeterminate";
              return this.attachmentsService.deleteAttachment(id);
            },
            () => {
              this.loadAttachments();
            },
            error => {
              SnackbarMessage.showErrorMessage(this.snackBar, error, 'Failed to delete attachment');
            }
          );
        }
      });
    }
  }

  onViewClick(attachmentIndex: number): void {
    let pageNumber = this.pageSettings.pageNumber;
    if(!pageNumber) {
      pageNumber = 0;
    }
    this.dialog.open(RepairJobAttachmentsViewComponent, {
      width: "90vh",
      height: "80vh",
      data: {
        repairJobId: this.repairJobId,
        attachmentNumber: attachmentIndex + pageNumber
      }
    });
  }
}
