import {
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges
} from '@angular/core';
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {AttachmentInfoVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/attachment-info-vo.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {AttachmentVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/attachment-vo.model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
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

@Component({
  selector: 'lib-repair-job-attachments-view',
  templateUrl: './repair-job-attachments-view.component.html',
  styleUrls: ['./repair-job-attachments-view.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class RepairJobAttachmentsViewComponent implements OnInit, OnChanges, OnDestroy {

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
    pageSize: 1,
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
              private sanitizer: DomSanitizer,
              @Optional() public dialogRef: MatDialogRef<RepairJobAttachmentsViewComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {
                attachmentNumber: number,
                repairJobId: number
              }) {
    if(this.dialogData) {
      if(this.dialogData.attachmentNumber) {
        this.pageSettings.pageNumber = this.dialogData.attachmentNumber;
      }

      if(this.dialogData.repairJobId) {
        this.repairJobId = this.dialogData.repairJobId;
      }
    }

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

  onPreviousClick(): void {
    let pageNumber = this.pageSettings.pageNumber;
    if(!pageNumber) {
      pageNumber = 0;
    }
    this.pageSettings.pageNumber = pageNumber > 0 ? pageNumber - 1 : 0;
    this.loadAttachments();
  }

  onNextClick(): void {
    let pageNumber = this.pageSettings.pageNumber;
    if(!pageNumber) {
      pageNumber = 0;
    }
    this.pageSettings.pageNumber = pageNumber < this.totalElements - 1 ? pageNumber + 1 : this.totalElements - 1;
    this.loadAttachments();
  }
}
