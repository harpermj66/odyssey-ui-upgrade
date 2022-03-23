import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {ApprovalLimitsService} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/service/approval-limits.service";
import {PageEvent} from "@angular/material/paginator";
import {ApprovalsModel} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/model/approvals.model";
import {ChangeDetector} from "../../../../../../odyssey-service-library/src/lib/utils/change-detector";
import {MatDialog} from "@angular/material/dialog";
import {ContTypeGroupService} from "../../../../../../odyssey-service-library/src/lib/mandr/cont-type-group/service/cont-type-group.service";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {ConfirmDeleteDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SortModel} from "../../../../../../odyssey-service-library/src/lib/model/sort.model";
import {PageableModel} from "../../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {Sort} from "@angular/material/sort";
import {
  ActionMenu, ActionMenuEvent,
  DataGridColumn, StandardDataGridTemplateComponent
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {FilterItem} from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {ApprovalLimitEditQueryParams} from "../query-params";
import {ActivatedRoute, Router} from "@angular/router";
import {Flatten} from "../../../../../../odyssey-service-library/src/lib/utils/flatten";

class FlatApproval extends ApprovalsModel {
  'depot.addressBook.addressName'?: string;
  [key: string]: any;

  constructor(toCopy: ApprovalsModel) {
    super();

    Object.assign(this, toCopy);
    Object.assign(this, Flatten.flatten(toCopy));
    const limits = toCopy.contApprovalLimits;

    if(limits) {
      // Flatten the container type -> approval limits map
      Object.getOwnPropertyNames(limits).forEach(prop => {
        this[FlatApproval.getFieldNameForContType(prop)] = limits[prop];
      });
    }

    this['depot.addressBook.addressName'] = this.depot?.nameShort;
  }

  public static getFieldNameForContType(contType: string): string {
    return 'contType_' + contType;
  }
}

class ApprovalActionMenu extends ActionMenu {
  constructor(public onClick: (row: ApprovalsModel) => void, actionId: string, title: string, enabled?: boolean, icon?: string) {
    super(actionId, title, enabled, icon);
  }
}

@Component({
  selector: 'lib-approval-limits-list',
  templateUrl: './approval-limits-list.component.html',
  styleUrls: ['./approval-limits-list.component.scss'],
  providers: [
    DiscardingRequestQueue,
    RequestQueue
  ]
})
export class ApprovalLimitsListComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild("dataGrid") dataGrid: StandardDataGridTemplateComponent;

  readonly fieldId = 'id';
  readonly fieldDepotName = 'depot.addressBook.addressName';

  multiselect = false;
  @Input() selected: ApprovalsModel[] = [];
  @Output() selectedChange: EventEmitter<ApprovalsModel[]> = new EventEmitter<ApprovalsModel[]>();
  @Input() contType: Array<string>=[];
  @Input() disabled = false;
  _readonly = false;

  datasource: MatTableDataSource<ApprovalsModel> = new MatTableDataSource<ApprovalsModel>();

  totalElements = 0;
  pageSettings: PageableModel = {
    pageSize: 10,
    pageNumber: 0,
    sort: [{field: this.fieldDepotName, direction: 'asc'}]
  };
  queued = false;

  private buttonsColumn =  new DataGridColumn('buttons', '', '', DataGridColumn.TYPE_STRING);
  private defaultColumns: DataGridColumn[] = [
    new DataGridColumn(this.fieldId, 'ID', '', DataGridColumn.TYPE_STRING),
    new DataGridColumn('currency.shortname', 'Currency', '', DataGridColumn.TYPE_STRING),
    new DataGridColumn(this.fieldDepotName, 'Location', '', DataGridColumn.TYPE_STRING)
  ];
  private limitColumns: DataGridColumn[] = [];

  private defaultHiddenColumns: DataGridColumn[] = [];

  private allColumns: DataGridColumn[] = this.defaultColumns.concat(this.defaultHiddenColumns).concat(this.limitColumns);

  displayableFields: FilterItem[] = [];
  displayableFieldsDefault: FilterItem[] = [];

  columns: DataGridColumn[] = this.defaultColumns.slice();
  displayedColumns: string[] = [];
  dataGridColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();

  private rowMenuView = new ApprovalActionMenu(this.onViewClick.bind(this), 'View', 'View', true, 'preview');
  private rowMenuEdit = new ApprovalActionMenu(this.onEditClick.bind(this), 'Edit', 'Edit', true, 'edit');
  private rowMenuDelete = new ApprovalActionMenu(this.onDeleteClick.bind(this), 'Delete', 'Delete', true, 'delete');

  private rowMenusReadonly: ActionMenu[] = [
    this.rowMenuView
  ];

  private rowMenusNonReadonly: ActionMenu[] = [
    this.rowMenuView,
    this.rowMenuEdit,
    this.rowMenuDelete
  ];

  rowMenus = this.rowMenusNonReadonly;

  dynamicColumns: string[] = [];

  selectedColumns?: FilterItem[];

  filter?: string;

  constructor(private approvalLimitsService: ApprovalLimitsService,
              private userService: CurrentUserService,
              private contTypeGroupsService: ContTypeGroupService,
              private loadingRequestQueue: DiscardingRequestQueue,
              private actionRequestQueue: RequestQueue,
              private changeDetector: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
  }

  get readonly(): boolean {
    return this._readonly || (!this.userService.user?.roles.MR_APPROVER && !this.userService.user?.roles.MR_EDITOR);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
    if(this._readonly) {
      this.rowMenus = this.rowMenusReadonly;
    } else {
      this.rowMenus = this.rowMenusNonReadonly;
    }
  }

  get loading(): boolean {
    return this.loadingRequestQueue.loading;
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

  refresh(): void {
    this.contTypeLoading();
    this.loadingRequestQueue.makeRequest(
      this.approvalLimitsService.getApprovals(this.pageSettings),
      page => {
        if(page.content) {
          this.datasource.data = page.content.map(a => new FlatApproval(a));
        } else {
          this.datasource.data = [];
        }
        this.totalElements = page.totalElements;
        this.onLoadComplete();
      },
      error => {
        this.onLoadComplete();
      }
    );
  }

  onColumnsChanged(selectedColumns?: FilterItem[]): void {
    this.selectedColumns = selectedColumns;
    this.columns = [];
    this.displayedColumns = [];
    this.dataGridColumnMaps = new Map<string, DataGridColumn>();

    this.allColumns = this.defaultColumns.concat(this.defaultHiddenColumns).concat(this.limitColumns);

    if(selectedColumns) {
      const unselectedColumnFieldNames = selectedColumns.filter(a => !a.visible).map(a => a.fieldName);
      this.allColumns.forEach(column => {
        if(!unselectedColumnFieldNames.includes(column.fieldName)) {
          this.columns.push(column);
        }
      });
    } else {
      this.columns = this.defaultColumns.concat(this.limitColumns);
    }

    this.columns.push(this.buttonsColumn);

    this.columns.forEach(column => {
      this.displayedColumns.push(column.fieldName);
      this.dataGridColumnMaps.set(column.fieldName, column);
    });
  }

  select(approval: ApprovalsModel): void {
    if(!this.selected) {
      this.selected = [];
    }

    if(!this.selected.map(a => a.id).includes(approval.id)) {
      if(this.multiselect) {
        this.selected.push(approval);
      } else {
        this.selected = [approval];
      }
      this.selectedChange.emit(this.selected);
    }
  }


  private onLoadComplete(): void {
    if(this.queued) {
      this.queued = false;
      this.refresh();
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

  trackById(index: number, entity: ApprovalsModel): any {
    return entity.id ? entity.id : index;
  }

  /**
   * Load the container types for this company so were can use them for columns.
   */
  contTypeLoading(): void{
    if(!this.limitColumns || this.limitColumns.length <= 0) {
      this.contTypeGroupsService.getContTypeGroupsByType(ContTypeGroupService.GROUP_TYPE_CONTAINER).subscribe(
        groups => {
          // Create dynamic columns for the container type groups
          this.limitColumns = groups.map(
            group => new DataGridColumn(
              FlatApproval.getFieldNameForContType(group.groupName),
              group.groupName, '',
              DataGridColumn.TYPE_STRING)
          );

          this.defaultColumns.concat(this.limitColumns).forEach(column => {
            this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, true));
            this.displayableFieldsDefault.push(new FilterItem(column.title, column.fieldName, column.type, null, true));
          });

          this.defaultHiddenColumns.forEach(column => {
            this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, false));
            this.displayableFieldsDefault.push(new FilterItem(column.title, column.fieldName, column.type, null, false));
          });

          this.onColumnsChanged(this.selectedColumns);
        }
      );
    }
  }

  ngOnDestroy(): void {
    ChangeDetector.destroy(this.changeDetector);
  }

  onEditClick(approval?: ApprovalsModel): void {
    const queryParams = new ApprovalLimitEditQueryParams();
    queryParams.mode = 'edit';
    queryParams.approvalLimitId = approval?.id;
    this.router.navigate(['../approval-limits-edit'], {queryParams, relativeTo: this.route});
  }

  onViewClick(approval: ApprovalsModel): void {
    const queryParams = new ApprovalLimitEditQueryParams();
    queryParams.mode = 'view';
    queryParams.approvalLimitId = approval.id;
    this.router.navigate(['../approval-limits-edit'], {queryParams, relativeTo: this.route});
  }

  onDeleteClick(approval: ApprovalsModel): void {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        entityTypeName: 'Approval Limit'
      }
    }).afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.actionRequestQueue.makeRequest(
          this.approvalLimitsService.deleteApprovals(approval.id),
          () => {
            this.refresh();
          },
          error => {
            SnackbarMessage.showErrorMessage(this.snackBar, error, 'Failed to delete Approval Limits');
          });
      }
    });
  }

  onRowActionSelected(event: ActionMenuEvent): void {
    const action = event.menu;
    if(action instanceof ApprovalActionMenu) {
      action.onClick(event.row);
    }
  }

  onCearSort(): void {
    this.dataGrid.clearSort();
    this.pageSettings.sort = [{field: 'locationName', direction: 'asc'}];
    this.refresh();
  }
}
