import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {RepairItemService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-item.service";
import {RepairItemModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-item.model";
import {PageModel} from "../../../../../../odyssey-service-library/src/lib/model/page.model";
import {CedexCodeService} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/service/cedex-code.service";
import {CedexCodeModel} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/model/cedex-code.model";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {MatDialog} from "@angular/material/dialog";
import {RepairCommentListComponent} from "../repair-comment-list/repair-comment-list.component";
import {ConfirmDeleteDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {ConfirmIgnoreValidationDialogComponent} from "../confirm-ignore-validation-dialog/confirm-ignore-validation-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {RepairJobService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job.service";
import {RepairJobModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job.model";
import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'lib-repair-item-list',
  templateUrl: './repair-item-list.component.html',
  styleUrls: ['./repair-item-list.component.scss'],
  providers: [
    DiscardingRequestQueue,
    RequestQueue
  ]
})
export class RepairItemListComponent implements OnInit, OnDestroy, OnChanges {

  readonly cedexTypeComponent = CedexCodeModel.TYPE_COMPONENT;
  readonly cedexTypeLocation = CedexCodeModel.TYPE_LOCATION;
  readonly cedexTypeDamage = CedexCodeModel.TYPE_DAMAGE;
  readonly cedexTypeRepair = CedexCodeModel.TYPE_REPAIR;

  @Input() repairJobId: number | null;
  @Input() repairJobNumber: string | null;

  multiselect = false;
  @Input() selected: RepairItemModel[] = [];
  @Output() selectedChange: EventEmitter<RepairItemModel[]> = new EventEmitter<RepairItemModel[]>();

  @Output() editClick = new EventEmitter<RepairItemModel>();
  @Output() addClick = new EventEmitter<void>();
  @Output() viewClick = new EventEmitter<RepairItemModel>();
  @Output() repairItemsUpdated = new EventEmitter<void>();

  @Input() disabled: boolean;
  _readonly: boolean;

  editMode = false;

  datasource: MatTableDataSource<RepairItemModel> = new MatTableDataSource<RepairItemModel>();

  pageSettings = {
    total: 0,
    pageSize: 10,
    pageNumber: 0,
  };

  displayedColumnsAllItems = [
    'machinery',
    'location',
    'component',
    'damage',
    'damageMeasurements',
    'repair',
    'hours',
    'labourRate',
    'labourCost',
    'materialCostPerUnit',
    'materialQuantity',
    'totalMaterialCost',
    'totalCost',
    'status',
    'remarks',
    'attachments',
    'menu'
  ];

  // Item Num column does not make any sense for showing lists of items from different jobs
  displayedColumnsJobSelected = ['itemNum'].concat(this.displayedColumnsAllItems.slice());

  displayedColumns = this.displayedColumnsAllItems.slice();

  /**
   * The repair items stringified for change checks.
   */
  originalItemStrings: {[id: number]: string} = {};

  repairJobRequestQueue = new DiscardingRequestQueue();
  repairJob?: RepairJobModel;

  constructor(private userService: CurrentUserService,
              private repairItemService: RepairItemService,
              private repairJobService: RepairJobService,
              public cedexCodeService: CedexCodeService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              // The request queue for data loading requests, that may be superseded by new requests
              public requestQueue: DiscardingRequestQueue,
              // The request queue for actions that should always be processed.
              public actionRequestQueue: RequestQueue) { }

  get readonly(): boolean {
    return this._readonly || !(this.userService.user?.roles.MR_EDITOR || this.userService.user?.roles.MR_APPROVER);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.repairJobId) {
      this.displayedColumns = this.repairJobId ? this.displayedColumnsJobSelected.slice() : this.displayedColumnsAllItems.slice();
      this.refresh();
    }
  }

  ngOnDestroy(): void {
    this.repairJobRequestQueue.destroy();
  }

  refresh(): void {
    this.loadRepairJob();

    let obs: Observable<PageModel<RepairItemModel>>;
    if(this.repairJobId) {
      obs = this.repairItemService.getRepairItemsForRepairJob(this.repairJobId, this.pageSettings);
    } else {
      obs = this.repairItemService.getRepairItems(this.pageSettings);
    }

    this.requestQueue.makeRequest(
      obs,
      page => {
        if(page.content) {
          this.datasource.data = page.content;
        } else {
          this.datasource.data = [];
        }
        this.pageSettings.total = page.totalElements;
      },
      error => {
      }
    );
  }

  select(item: RepairItemModel): void {
    if(!this.selected) {
      this.selected = [];
    }

    if(!this.selected.map(a => a.id).includes(item.id)) {
      if(this.multiselect) {
        this.selected.push(item);
      } else {
        this.selected = [item];
      }
      this.selectedChange.emit(this.selected);
    }
  }

  private loadRepairJob(): void {
    delete this.repairJob;
    if(this.repairJobId) {
      this.repairJobRequestQueue.makeRequest(
        this.repairJobService.getRepairJob(this.repairJobId),
        job => {
          this.repairJob = job;
        },
        error => {
          SnackbarMessage.showErrorMessage(this.snackBar, error,'Could not load repair job');
        }
      );
    } else {
      this.repairJobRequestQueue.cancelRequests();
    }
  }

  onPagingChanged(event: PageEvent): void {
    this.pageSettings.pageSize = event.pageSize;
    this.pageSettings.pageNumber = event.pageIndex;
    this.refresh();
  }

  trackById(index: number, entity: RepairItemModel): any {
    return entity.id ? entity.id : index;
  }

  onOpenEditMode(): void {
    if(this.datasource.data) {
      this.datasource.data.forEach( item =>
        this.originalItemStrings[item.id] = JSON.stringify(item)
      );
    } else {
      this.originalItemStrings = {};
    }
    this.editMode = true;
  }

  onCancelChanges(): void {
    if(this.getItemsWithChanges().length === 0) {
      this.originalItemStrings = {};
      this.editMode = false;
      this.refresh();
    } else {
      this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
        discardChanges => {
          if(discardChanges) {
            this.originalItemStrings = {};
            this.editMode = false;
            this.refresh();
          }
        }
      );
    }
  }

  onSaveAll(): void {
    this.save(this.getItemsWithChanges());
  }

  private getItemsWithChanges(): RepairItemModel[] {
    const toSave: RepairItemModel[] = [];
    if(this.datasource.data) {
      this.datasource.data.forEach( item => {
        if(JSON.stringify(item) !== this.originalItemStrings[item.id]) {
          toSave.push(item);
        }
      });
    }
    return toSave;
  }

  onCommentClick(repairItem: RepairItemModel): void {
    this.dialog.open(RepairCommentListComponent,{
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '60vw',
      minWidth: '400px',
      minHeight: '400px',
      data: {
        repairItemId: repairItem?.id,
        readonly: this.readonly,
        disabled: this.disabled
      }
    });
  }

  onDeleteClick(item: RepairItemModel): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        entityTypeName: "Item"
      }
    }).afterClosed().subscribe(shouldDelete => {
      if(shouldDelete) {
        this.actionRequestQueue.makeRequest(
          this.repairItemService.deleteRepairItem(item.id),
          () => {
            this.refresh();
          },
          error => {
            if(error.status === 406) {
              this.handleDeleteNotAcceptable(item, error.error as ValidationExceptionModel);
            } else {
              this.onDeleteFailure(error);
            }
          });
      }
    });
  }

  onDeleteIgnoreValidation(item: RepairItemModel): void {
    this.actionRequestQueue.makeRequest(
      this.repairItemService.deleteRepairItem(item.id, true),
      () => {
        this.refresh();
      },
      error => {
        this.onDeleteFailure(error);
      }
    );
  }

  private handleDeleteNotAcceptable(item: RepairItemModel, errorModel?: ValidationExceptionModel): void {
    if(errorModel && errorModel.type === ValidationExceptionModel.TYPE_WARNING) {
      this.dialog.open(ConfirmIgnoreValidationDialogComponent,{
        data: {
          action: 'Delete',
          validationIssues: errorModel.validationIssues
        }
      }).afterClosed().subscribe((shouldForceDelete: boolean) => {
        if(shouldForceDelete) {
          this.onDeleteIgnoreValidation(item);
        }
      });
    } else {
      this.onDeleteFailure(errorModel);
    }
  }

  private onDeleteFailure(error: any): void {
    this.refresh();
    SnackbarMessage.showErrorMessage(this.snackBar, error, 'Could not delete item');
  }

  private save(items: RepairItemModel[]): void {
      const item = items.pop();
      if(item) {
        this.actionRequestQueue.makeRequest(
          this.repairItemService.updateRepairItem(item.id, item),
          () => {
            if (items.length === 0) {
              this.onSaveComplete();
            } else {
              this.save(items);
            }
          },
          error => {
            if (items.length === 0) {
              this.onSaveComplete();
            } else {
              this.save(items);
            }
          }
        );
      } else {
        this.onSaveComplete();
      }
  }

  private onSaveComplete(): void {
    this.originalItemStrings = {};
    this.editMode = false;
    this.refresh();
    this.repairItemsUpdated.next();
  }

  // tslint:disable:max-line-length
  onApproveAll(): void {
    if(this.repairJobId) {
      this.actionRequestQueue.makeRequest(
        this.repairItemService.approveAllForRepairJob(this.repairJobId),
        () => {
          this.refresh();
          this.repairItemsUpdated.next(); // need to refresh the repair job in upper form, to enable approve button now that all repair items are approved
        },
        error => {
          this.refresh();
        }
      );
    }
  }

  onAddEditClick(repairItem?: RepairItemModel): void {
    if(this.repairJobId) {
      if (repairItem?.id) {
        this.editClick.next(repairItem);
      } else {
        this.addClick.next();
      }
    }
  }

  onViewClick(repairItem: RepairItemModel): void {
    if(this.repairJobId) {
      this.viewClick.next(repairItem);
    }
  }

  getLocationCodeDescription(item: RepairItemModel): Observable<string> {
    // Join the (up to) four characters of the location code.
    return forkJoin({
      loc1: this.cedexCodeService.getLocation1CodeDescription(
        item.locationCode && item.locationCode.length > 0 ? item.locationCode.charAt(0) : '',
        this.repairJob?.containerStock?.contType),
      loc2: this.cedexCodeService.getLocation2CodeDescription(
        item.locationCode && item.locationCode.length > 1 ? item.locationCode.charAt(1) : '',
        this.repairJob?.containerStock?.contType,
        item.machinery),
      loc3: this.cedexCodeService.getLocation3CodeDescription(
        item.locationCode && item.locationCode.length > 2 ? item.locationCode.charAt(2) : '',
        this.repairJob?.containerStock?.contType),
      loc4: this.cedexCodeService.getLocation4CodeDescription(
        item.locationCode && item.locationCode.length > 3 ? item.locationCode.charAt(3) : '',
        this.repairJob?.containerStock?.contType),
      }).pipe(map(({loc1, loc2, loc3, loc4}) => {
        const descs: string[] = [];
        if(loc1 && loc1.trim() !== '') {
          descs.push(loc1);
          if(loc2 && loc2.trim() !== '') {
            descs.push(loc2);
            if(loc3 && loc3.trim() !== '') {
              descs.push(loc3);
              if(loc4 && loc4.trim() !== '') {
                descs.push(loc4);
              }
            }
          }
        }
        return descs.join(', ');
    }));
  }

  getComponentCodeDescription(item: RepairItemModel): Observable<string> {
    return this.cedexCodeService.getComponentCodeDescription(
      item.componentCode,
      this.repairJob?.containerStock?.contType,
      item.machinery,
      item.locationCode);
  }

  getDamageCodeDescription(item: RepairItemModel): Observable<string> {
    return this.cedexCodeService.getDamageCodeDescription(
      item.damageCode,
      this.repairJob?.containerStock?.contType);
  }

  getRepairCodeDescription(item: RepairItemModel): Observable<string> {
    return this.cedexCodeService.getRepairCodeDescription(
      item.repairCode,
      this.repairJob?.containerStock?.contType);
  }
}
