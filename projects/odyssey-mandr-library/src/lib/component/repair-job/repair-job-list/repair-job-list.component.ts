import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {RepairJobModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job.model";
import {RepairJobService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job.service";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {ConfirmDeleteDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {ConfirmIgnoreValidationDialogComponent} from "../confirm-ignore-validation-dialog/confirm-ignore-validation-dialog.component";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {Sort} from "@angular/material/sort";
import {SortModel} from "../../../../../../odyssey-service-library/src/lib/model/sort.model";
import {PageableModel} from "../../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {
  ActionMenu,
  ActionMenuEvent,
  DataGridColumn,
  StandardDataGridTemplateComponent
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {FilterItem} from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {ActivatedRoute, Router} from "@angular/router";
import {RepairJobEditQueryParams} from "../query-params";
import {RepairJobStatus} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job-status";
import {Flatten} from "../../../../../../odyssey-service-library/src/lib/utils/flatten";

class FlatJob extends RepairJobModel {
  [fieldName: string]: any;
  'containerStock.containerNumber'?: string;
  'company.companyName'?: string;

  constructor(repairJob: RepairJobModel) {
    super();
    Object.assign(this, repairJob);

    // Flatten inner fields to a property with a name like field.innerField
    // (so when the field is sorted on it works with the spring pageable sort)
    Object.assign(this, Flatten.flatten(repairJob));

    this.status = RepairJobStatus.getDisplayName(this.status);
  }
}

class RjActionMenu extends ActionMenu {
  constructor(
    public onClick: (row: RepairJobModel) => void,
    actionId: string,
    title: string,
    enabled?: boolean,
    icon?: string,
    isEnabled: (row: any, user: CurrentUser | null) => boolean | undefined = (_) => true
  ) {
    super(actionId, title, enabled, icon, isEnabled);
  }
}

@Component({
  selector: 'lib-repair-job-list',
  templateUrl: './repair-job-list.component.html',
  styleUrls: ['./repair-job-list.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class RepairJobListComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild("dataGrid") dataGrid: StandardDataGridTemplateComponent;

  readonly fieldJobNum = 'jobNum';
  readonly fieldContainerNum = 'containerStock.containerNumber';
  readonly fieldCompanyName = 'company.companyName';

  multiselect = false;
  @Input() selected: RepairJobModel[] = [];
  @Output() selectedChange: EventEmitter<RepairJobModel[]> = new EventEmitter<RepairJobModel[]>();

  @Input() disabled: boolean;
  _readonly: boolean;

  datasource: MatTableDataSource<RepairJobModel> = new MatTableDataSource<RepairJobModel>();

  totalElements = 0;
  pageSettings: PageableModel = {
    pageSize: 10,
    pageNumber: 0,
    sort: [{field: 'locationName', direction: 'asc'}]
  };

  private buttonsColumn =  new DataGridColumn('buttons', '', '', DataGridColumn.TYPE_STRING, false);
  private defaultColumns: DataGridColumn[] = [
    new DataGridColumn('locationName', 'Depot/Terminal', '', DataGridColumn.TYPE_STRING, true),
    new DataGridColumn(this.fieldJobNum, 'Job ID', '', DataGridColumn.TYPE_STRING, true),
    new DataGridColumn(this.fieldContainerNum, 'Equipment ID', '', DataGridColumn.TYPE_STRING, true),
    new DataGridColumn('estimateCost', 'Estimate', '', DataGridColumn.TYPE_STRING, true),
    new DataGridColumn('dueDate', 'Due Date', '', DataGridColumn.TYPE_DATE, true),
    new DataGridColumn('turnInDate', 'Turn In Date', '', DataGridColumn.TYPE_DATE, true),
    new DataGridColumn('status', 'Status', '', DataGridColumn.TYPE_ENUM, true)
  ];

  private defaultHiddenColumns: DataGridColumn[] = [
    new DataGridColumn(this.fieldCompanyName, 'Carrier', '', DataGridColumn.TYPE_STRING, true)
  ];

  private allColumns: DataGridColumn[] = this.defaultColumns.concat(this.defaultHiddenColumns);

  displayableFields: FilterItem[] = [];
  displayableFieldsDefault: FilterItem[] = [];

  columns: DataGridColumn[] = this.defaultColumns.slice();
  displayedColumns: string[] = [];
  dataGridColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();

  // tslint:disable:member-ordering
  isEnabledCheck(row: RepairJobModel, user: CurrentUser | null): boolean | undefined {
    if ([RepairJobStatus.DISPLAY_STATUS_DRAFT, RepairJobStatus.DISPLAY_STATUS_PENDING].includes(row.status)) {
      if (!user?.roles.MR_APPROVER && !user?.roles.MR_EDITOR) {
        return false; // only approvers and editors can edit draft and pending jobs
      }
    }
    if ([RepairJobStatus.DISPLAY_STATUS_APPROVED, RepairJobStatus.DISPLAY_STATUS_APPROVED_AND_SENT].includes(row.status)) {
      if (!user?.roles.MR_APPROVER) {
        return false; // only approvers can edit approved or approved and sent jobs
      }
    }
    if ([RepairJobStatus.DISPLAY_STATUS_COMPLETE, RepairJobStatus.DISPLAY_STATUS_REJECTED].includes(row.status)) {
      return false; // no one can edit complete or rejected jobs
    }
    return true;
  }
  private rowMenuView = new RjActionMenu(this.onViewClick.bind(this), 'View', 'View', true, 'preview');
  private rowMenuEdit = new RjActionMenu(this.onEditAddClick.bind(this), 'Edit', 'Edit', true, 'edit', this.isEnabledCheck);
  private rowMenuDelete = new RjActionMenu(this.onDeleteClick.bind(this), 'Delete', 'Delete', true, 'delete', this.isEnabledCheck);

  private rowMenusReadonly: ActionMenu[] = [
    this.rowMenuView, this.rowMenuEdit
  ];

  private rowMenusNonReadonly: ActionMenu[] = [
    this.rowMenuView,
    this.rowMenuEdit,
    this.rowMenuDelete
  ];

  rowMenus = this.rowMenusNonReadonly;

  filter = '';

  constructor(private userService: CurrentUserService,
              private repairJobService: RepairJobService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private requestQueue: DiscardingRequestQueue) {
    this.onColumnsChanged();

    this.defaultColumns.forEach(column => {
      this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, true));
      this.displayableFieldsDefault.push(new FilterItem(column.title, column.fieldName, column.type, null, true));
    });

    this.defaultHiddenColumns.forEach(column => {
      this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, false));
      this.displayableFieldsDefault.push(new FilterItem(column.title, column.fieldName, column.type, null, false));
    });
  }

  get readonly(): boolean {
    return this._readonly || !(this.userService.user?.roles.MR_EDITOR || this.userService.user?.roles.MR_APPROVER);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
    if(this._readonly) {
      this.rowMenus = this.rowMenusReadonly;
    } else {
      this.rowMenus = this.rowMenusNonReadonly;
    }
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.disabled) {
      this.rowMenuView.enabled = !this.disabled;
      this.rowMenuEdit.enabled = !this.disabled;
      this.rowMenuDelete.enabled = !this.disabled;
    }
  }

  ngOnDestroy(): void {
  }

  onColumnsChanged(selectedColumns?: FilterItem[]): void {
    this.columns = [];
    this.displayedColumns = [];
    this.dataGridColumnMaps = new Map<string, DataGridColumn>();

    if(selectedColumns) {
      const selectedColumnFieldNames = selectedColumns.filter(a => a.visible).map(a => a.fieldName);
      this.allColumns.forEach(column => {
        if(selectedColumnFieldNames.includes(column.fieldName)) {
          this.columns.push(column);
        }
      });
    } else {
      this.columns = this.defaultColumns.slice();
    }

    this.columns.push(this.buttonsColumn);

    this.columns.forEach(column => {
      this.displayedColumns.push(column.fieldName);
      this.dataGridColumnMaps.set(column.fieldName, column);
    });
  }

  refresh(): void {
    this.requestQueue.makeRequest(
      this.repairJobService.searchRepairJobs(this.pageSettings, this.filter),
      page => {
        if(page.content) {
          this.datasource.data = page.content.map(job => new FlatJob(job));
        } else {
          this.datasource.data = [];
        }
        this.totalElements = page.totalElements;
      },
      error => {
      }
    );
  }

  save(job: RepairJobModel): void {
    this.repairJobService.saveRepairJob(job).subscribe(
        () => this.refresh()
    );
  }

  select(item: RepairJobModel): void {
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

  onPagingChanged(event: PageEvent): void {
    this.pageSettings.pageSize = event.pageSize;
    this.pageSettings.pageNumber = event.pageIndex;
    this.refresh();
  }

  onSortChange(sort: Sort): void {
    this.pageSettings.sort = SortModel.fromSort(sort, 'id', 'desc');
    this.pageSettings.pageNumber = 0;
    this.refresh();
  }

  trackById(index: number, entity: RepairJobModel): any {
    return entity.id ? entity.id : index;
  }

  onViewClick(job: RepairJobModel): void {
    const queryParams = new RepairJobEditQueryParams();
    queryParams.mode ='view';
    if(job) {
      queryParams.repairJobId = job.id;
    }
    this.router.navigate(['../repair-job-edit'], {queryParams, relativeTo: this.route});
  }

  onEditAddClick(job?: RepairJobModel): void {
    const queryParams = new RepairJobEditQueryParams();
    queryParams.mode ='edit';
    if(job) {
      queryParams.repairJobId = job.id;
    }
    this.router.navigate(['../repair-job-edit'], {queryParams, relativeTo: this.route});
  }

  onDeleteClick(job: RepairJobModel): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        entityTypeName: "Job"
      }
    }).afterClosed().subscribe(shouldDelete => {
      if(shouldDelete) {
        this.repairJobService.deleteRepairJob(job.id).subscribe(
          () => {
            this.refresh();
          },
          error => {
            if(error.status === 406) {
              this.handleDeleteNotAcceptable(job, error.error as ValidationExceptionModel);
            } else {
              this.onDeleteFailure(error);
            }
          });
      }
    });
  }

  onDeleteIgnoreValidation(job: RepairJobModel): void {
    this.repairJobService.deleteRepairJob(job.id, true).subscribe(
      () => {
        this.refresh();
      },
      error => {
        this.onDeleteFailure(error);
      }
    );
  }

  private handleDeleteNotAcceptable(job: RepairJobModel, errorModel?: ValidationExceptionModel): void {
    if(errorModel && errorModel.type === ValidationExceptionModel.TYPE_WARNING) {
      this.dialog.open(ConfirmIgnoreValidationDialogComponent,{
        data: {
          action: 'Delete',
          validationIssues: errorModel.validationIssues
        }
      }).afterClosed().subscribe((shouldForceDelete: boolean) => {
        if(shouldForceDelete) {
          this.onDeleteIgnoreValidation(job);
        }
      });
    } else {
      this.onDeleteFailure(errorModel);
    }
  }

  private onDeleteFailure(error: any): void {
    this.refresh();
    SnackbarMessage.showErrorMessage(this.snackBar, error, 'Could not delete job');
  }

  onRowActionSelected(event: ActionMenuEvent): void {
    const menu = event.menu;
    if(menu instanceof RjActionMenu) {
      menu.onClick(event.row as RepairJobModel);
    }
  }

  onClearSort(): void {
    this.dataGrid.clearSort();
    this.pageSettings.sort = [{field: this.fieldCompanyName, direction: 'asc'}];
    this.refresh();
  }
}
