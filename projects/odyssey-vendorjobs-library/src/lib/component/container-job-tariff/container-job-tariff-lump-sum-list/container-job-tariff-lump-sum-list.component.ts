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
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {ConfirmDeleteDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {Sort} from "@angular/material/sort";
import {SortModel} from "../../../../../../odyssey-service-library/src/lib/model/sort.model";
import {PageableModel} from "../../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {
  ActionMenu, ActionMenuEvent,
  DataGridColumn, StandardDataGridTemplateComponent
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {FilterItem} from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {ContainerJobTariffModel} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/model/container-job-tariff.model";
import {ContainerJobTariffService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-tariff.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  ContainerJobTariffEditQueryParams
} from "../container-job-tariff-edit/container-job-tariff-edit.component";
import {flatMap, Observable, of, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ContainerJobTypeService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-type.service";
import {FlatJobTariff} from "../flat-job-tariff";
import {ContTypeGroupService} from "../../../../../../odyssey-service-library/src/lib/mandr/cont-type-group/service/cont-type-group.service";

class CjtActionMenu extends ActionMenu {
  constructor(public onClick: (row: ContainerJobTariffModel) => void, actionId: string, title: string, enabled?: boolean, icon?: string) {
    super(actionId, title, enabled, icon);
  }
}

@Component({
  selector: 'lib-container-job-tariff-lump-sum-list',
  templateUrl: './container-job-tariff-lump-sum-list.component.html',
  styleUrls: ['./container-job-tariff-lump-sum-list.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class ContainerJobTariffLumpSumListComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild("dataGrid") dataGrid: StandardDataGridTemplateComponent;

  readonly fieldId = 'id';

  multiselect = false;
  @Input() selected: ContainerJobTariffModel[] = [];
  @Output() selectedChange: EventEmitter<ContainerJobTariffModel[]> = new EventEmitter<ContainerJobTariffModel[]>();

  @Input() disabled: boolean;
  _readonly: boolean;

  datasource: MatTableDataSource<ContainerJobTariffModel> = new MatTableDataSource<ContainerJobTariffModel>();

  totalElements = 0;
  pageSettings: PageableModel = {
    pageSize: 10,
    pageNumber: 0,
    sort: [{field: 'depotName', direction: 'desc'}]
  };

  private buttonsColumn =  new DataGridColumn('buttons', '', '', DataGridColumn.TYPE_STRING);
  private defaultColumns: DataGridColumn[] = [
    new DataGridColumn('depotName', 'Depot', '', DataGridColumn.TYPE_STRING),
    new DataGridColumn('jobType', 'Job Type', '', DataGridColumn.TYPE_STRING),
    new DataGridColumn('hazardous', 'Hazardous', '', DataGridColumn.TYPE_ENUM),
    new DataGridColumn('empty', 'Container Empty/Full', '', DataGridColumn.TYPE_ENUM),
    new DataGridColumn('currencyShort', 'Currency', '', DataGridColumn.TYPE_STRING),
    new DataGridColumn('validFrom', 'Valid From', '', DataGridColumn.TYPE_DATE),
    new DataGridColumn('validTo', 'Valid To', '', DataGridColumn.TYPE_DATE),
  ];

  private containerTypeColumns: DataGridColumn[] = [];

  private defaultHiddenColumns: DataGridColumn[] = [
    new DataGridColumn('companyName', 'Carrier', '', DataGridColumn.TYPE_STRING)
  ];

  displayableFields: FilterItem[] = [];

  columns: DataGridColumn[] = this.defaultColumns.slice();
  displayedColumns: string[] = [];
  dataGridColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();

  private rowMenuView = new CjtActionMenu(this.onViewClick.bind(this), 'View', 'View', true, 'preview');
  private rowMenuEdit = new CjtActionMenu(this.onEditAddClick.bind(this), 'Edit', 'Edit', true, 'edit');
  private rowMenuDelete = new CjtActionMenu(this.onDeleteClick.bind(this), 'Delete', 'Delete', true, 'delete');

  private rowMenusReadonly: ActionMenu[] = [
    this.rowMenuView
  ];

  private rowMenusNonReadonly: ActionMenu[] = [
    this.rowMenuView,
    this.rowMenuEdit,
    this.rowMenuDelete
  ];

  rowMenus = this.rowMenusNonReadonly;

  jobTypes: string[] = [];
  contTypeGroups: string[] = [];

  @Input() filter = '';

  constructor(private userService: CurrentUserService,
              private tariffService: ContainerJobTariffService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private jobTypeService: ContainerJobTypeService,
              private contTypeGroupsService: ContTypeGroupService,
              private snackbar: MatSnackBar,
              private requestQueue: DiscardingRequestQueue) {
    this.onColumnsChanged();

    this.defaultColumns.forEach(column => {
      this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, true));
    });

    this.defaultHiddenColumns.forEach(column => {
      this.displayableFields.push(new FilterItem(column.title, column.fieldName, column.type, null, false));
    });
  }

  get readonly(): boolean {
    return this._readonly
      || this.route.snapshot.queryParams.mode === 'view'
      || !(this.userService.user?.roles.VENDOR_JOB_APPROVER || this.userService.user?.roles.VENDOR_JOB_EDITOR);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
    if(this._readonly) {
      this.rowMenus = this.rowMenusReadonly;
    } else {
      this.rowMenus = this.rowMenusNonReadonly;
    }
  }

  get allColumns(): DataGridColumn[] {
    return this.defaultColumns.concat(this.containerTypeColumns).concat(this.defaultHiddenColumns);
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
      this.columns = this.defaultColumns.concat(this.containerTypeColumns);
    }

    this.columns.push(this.buttonsColumn);

    this.columns.forEach(column => {
      this.displayedColumns.push(column.fieldName);
      this.dataGridColumnMaps.set(column.fieldName, column);
    });
  }

  /**
   * Load the job types from the server
   */
  loadTypes(): Observable<string[]> {
    if(!this.jobTypes || this.jobTypes.length === 0) {
        return this.jobTypeService.getTypes().pipe(
          map(
            types => {
              this.jobTypes = types.filter(type => type !== ContainerJobTypeService.LABOUR_RATE);
              return this.jobTypes;
            }
          ),
          catchError(
            error => {
              error.handled = true;
              SnackbarMessage.showErrorMessage(this.snackbar, error, 'Could not Tariff Job Types');
              return throwError(error);
            }
          )
        );
    } else {
      return of(this.jobTypes);
    }
  }

  /**
   * Load the container type groups from the server.
   * @private
   */
  private loadContTypeGroups(): Observable<string[]> {
    if (!this.contTypeGroups || this.contTypeGroups.length === 0) {
      return this.contTypeGroupsService.getContTypeGroupsByType(ContTypeGroupService.GROUP_TYPE_CONTAINER)
        .pipe(
          map(
            contTypeGroups => {
              this.contTypeGroups = contTypeGroups.map(a => a.groupName);
              this.containerTypeColumns = contTypeGroups.map(a =>
                new DataGridColumn('amounts.' + a.groupName, a.groupName, '', DataGridColumn.TYPE_BIG_DECIMAL)
              );
              this.onColumnsChanged();
              return this.contTypeGroups;
            }
          ),
          catchError(
            error => {
              error.handled = true;
              SnackbarMessage.showErrorMessage(this.snackbar, error, 'Could not load Container Type Groups');
              return throwError(error);
            }
          )
        );
    } else {
      return of(this.contTypeGroups);
    }
  }

  /**
   * Loads the container groups and job types.
   * @private
   */
  private loadContGroupsAndTypes(): Observable<string[]> {
    return this.loadTypes().pipe(
      flatMap(
        contTypeGroups => this.loadContTypeGroups()
      )
    );
  }

  refresh(): void {
    this.requestQueue.makeRequest(
      this.loadContGroupsAndTypes()
        .pipe(
          flatMap(nonLabourRateTypes => this.tariffService.getTariffs(this.pageSettings, this.filter, false))
        ),
      page => {
        if(page.content) {
          this.datasource.data = page.content.map(tariff => new FlatJobTariff(tariff));
        } else {
          this.datasource.data = [];
        }
        this.totalElements = page.totalElements;
      },
      error => {
      }
    );
  }

  save(tariff: ContainerJobTariffModel): void {
    this.tariffService.createOrUpdateTariff(tariff).subscribe(
        () => this.refresh()
    );
  }

  select(item: ContainerJobTariffModel): void {
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

  trackById(index: number, entity: ContainerJobTariffModel): any {
    return entity.id ? entity.id : index;
  }

  onViewClick(tariff: ContainerJobTariffModel): void {
    const queryParams = new ContainerJobTariffEditQueryParams();
    queryParams.mode = 'view';
    queryParams.containerJobTariffId = tariff.id;
    this.router.navigate(['../../tariff-edit'], {queryParams, relativeTo: this.route});
  }

  onEditAddClick(tariff?: ContainerJobTariffModel): void {
    const queryParams = new ContainerJobTariffEditQueryParams();
    queryParams.mode ='edit';
    if(tariff) {
      queryParams.containerJobTariffId = tariff.id;
    }
    this.router.navigate(['../../tariff-edit'], {queryParams, relativeTo: this.route});
  }

  onDeleteClick(tariff: ContainerJobTariffModel): void {
    const id = tariff.id;
    if(id) {
      this.dialog.open(ConfirmDeleteDialogComponent, {
        data: {
          entityTypeName: "Job"
        }
      }).afterClosed().subscribe(shouldDelete => {
        if(shouldDelete) {
          this.tariffService.deleteTariff(id).subscribe(
            () => {
              this.refresh();
            },
            error => {
              this.onDeleteFailure(error);
            });
        }
      });
    }
  }

  private onDeleteFailure(error: any): void {
    this.refresh();
    SnackbarMessage.showErrorMessage(this.snackBar, error, 'Could not delete tariff');
  }

  onRowActionSelected(event: ActionMenuEvent): void {
    const menu = event.menu;
    if(menu instanceof CjtActionMenu) {
      menu.onClick(event.row as ContainerJobTariffModel);
    }
  }

  onCearSort(): void {
    this.dataGrid.clearSort();
    this.pageSettings.sort = [{field: 'depotName', direction: 'asc'}];
    this.refresh();
  }
}
