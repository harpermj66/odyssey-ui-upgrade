import {
  AfterViewInit,
  Component, ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges, ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {InfiniteScroll} from "../../../../../../odyssey-service-library/src/lib/utils/infinite-scroll";
import {RepairCommentModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-comment.model";
import {RepairItemCommentService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-item-comment.service";
import {PageModel} from "../../../../../../odyssey-service-library/src/lib/model/page.model";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {RepairCommentService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-comment.service";
import {RepairJobCommentService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job-comment.service";

@Component({
  selector: 'lib-repair-comment-list',
  templateUrl: './repair-comment-list.component.html',
  styleUrls: ['./repair-comment-list.component.scss']
})
export class RepairCommentListComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('scrollPanel') scrollElement: ElementRef;

  @Input() repairItemId?: number;
  @Input() repairJobId?: number;

  @Input() disabled: boolean;
  @Input() readonly: boolean;

  filter = '';
  comments: RepairCommentModel<any>[] = [];

  infiniteScroll: InfiniteScroll<RepairCommentModel<any>>;

  newComment: RepairCommentModel<any> = new RepairCommentModel();

  saving = false;

  constructor(private dialog: MatDialog,
              private repairItemCommentService: RepairItemCommentService,
              private repairJobCommentService: RepairJobCommentService,
              @Optional() public dialogRef: MatDialogRef<RepairCommentListComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {
                repairItemId?: number,
                repairJobId?: number,
                readonly: boolean,
                disabled: boolean
              }) {
    if(this.dialogData) {
      this.repairItemId = this.dialogData.repairItemId;
      this.repairJobId = this.dialogData.repairJobId;
      this.disabled = this.dialogData.disabled;
      this.readonly = this.dialogData.readonly;
    }

    this.infiniteScroll = new InfiniteScroll<RepairCommentModel<any>>(
      pageable => {
        return this.commentService.searchCommentsForEntity(this.entityId, pageable, this.filter);
      },
      this.processPage.bind(this),
      this.handleError.bind(this)
    ).setPageSize(5).setSort([{field: 'created', direction: 'desc'}]);
  }

  get isMainDialog(): boolean {
    // Ensure wqe are the main dialog ref, we may end up with a parent components ref
    return this.dialogRef?.componentInstance === this;
  }

  private get commentService(): RepairCommentService<any> {
    if(this.repairItemId) {
      return this.repairItemCommentService;
    } else if(this.repairJobId) {
      return this.repairJobCommentService;
    }
    throw new Error("No repairItemId or repairJobId defined for RepairCommentListComponent");
  }

  private get entityId(): number {
    if(this.repairItemId) {
      return this.repairItemId;
    } else if(this.repairJobId) {
      return this.repairJobId;
    }
    throw new Error("No repairItemId or repairJobId defined for RepairCommentListComponent");
  }

  get hasContent(): boolean {
    return !!this.newComment?.comment && this.newComment.comment.trim() !== '';
  }

  get busy(): boolean {
    return this.saving || this.infiniteScroll.loading;
  }

  get canSave(): boolean {
    return !this.busy && !this.disabled && this.hasContent;
  }

  ngOnInit(): void {
    if(this.entityId) {
      this.infiniteScroll.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.infiniteScroll.setElement(this.scrollElement.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.repairItemId) {
      this.filter = '';
      this.comments = [];
      if(this.entityId) {
        this.infiniteScroll.firstPage();
      }
    }
  }

  onFilterChange(): void {
    if(this.entityId) {
      this.infiniteScroll.firstPage();
    }
  }

  processPage(page: PageModel<RepairCommentModel<any>>): void {
    if(page.content) {
      if(page.number === 0) {
        this.comments = [];
      }
      page.content.forEach(a => this.comments.push(a));
    }

    // Keep loading for the infinite scroll as we do not have enough loaded to have a scroll bar
    if(this.infiniteScroll.element && !this.infiniteScroll.hasScrollBar()) {
      this.infiniteScroll.nextPage();
    }
  }

  handleError(error: any): void {
  }

  trackById(index: number, entity: RepairCommentModel<any>): any {
    return entity.id ? entity.id : index;
  }

  saveNewComment(): void {
    if(!this.saving && this.hasContent) {
      this.saving = true;
      this.newComment.type = "MANUAL";
      this.commentService.addCommentToEntity(this.entityId, this.newComment).subscribe(
        result => {
          this.saving = false;
          this.newComment = new RepairCommentModel();
          this.infiniteScroll.firstPage();
        },
        error => {
          this.saving = false;
        }
      );
    }
  }

  onClose(): void {
    if(this.dialogRef) {
      if(!this.newComment.comment || this.newComment.comment.trim().length === 0) {
        this.dialogRef.close();
      } else {
        this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
          close => {
            if(close) {
              this.dialogRef.close();
            }
          }
        );
      }
    }
  }

  onCancelComment(): void {
    if(this.dialogRef) {
      if(!this.newComment.comment || this.newComment.comment.trim().length === 0) {
        this.newComment = new RepairCommentModel();
      } else {
        this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
          clear => {
            if(clear) {
              this.newComment = new RepairCommentModel();
            }
          }
        );
      }
    }
  }
}
