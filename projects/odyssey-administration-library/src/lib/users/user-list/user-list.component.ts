import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FindModel} from "../../../../../odyssey-service-library/src/lib/api/find-model";
import {ResultModel} from "../../../../../odyssey-service-library/src/lib/api/result-model";
import {UserRemoteService} from "../../../../../odyssey-service-library/src/lib/administration/user-remote.service";
import {SearchOpsService} from "../../../../../odyssey-service-library/src/lib/api/search-ops.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  AuthenticationService
} from "../../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {SelectionModel} from "@angular/cdk/collections";
import {
  FilterItem,
  FilterItemValues
} from "../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  ActionMenu,
  DataGridColumn
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {Sort} from "@angular/material/sort";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";

class UserListModel {
  constructor(public guid: string,
              public name: string,
              public password: string,
              public fullName: string,
              public email: string,
              public enabled: boolean,
              public locked: boolean,
              public groupNames: string,
              public roles: any[]) {
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [SearchOpsService]
})
export class UserListComponent implements OnInit {

  displayColumns = ['select','title','status','firstName','lastName','jobTitle','coBranch','email','officePhone','officeFax','mobilePhone','createdDate','lastLogin','buttons'];

  columnMappings: Map<string, DataGridColumn> = new Map([
    ["title", {fieldName: 'title', title: 'Title', align: '', type: 'String', sortable: true, collection: false}],
    ["status", {fieldName: 'status', title: 'Status', align: '', type: 'String', sortable: true, collection: false}],
    ["firstName", {fieldName: 'firstName', title: 'First Name', align: '', type: 'String', sortable: true, collection: false}],
    ["lastName", {fieldName: 'lastName', title: 'Last Name', align: '', type: 'String', sortable: true, collection: false}],
    ["jobTitle", {fieldName: 'jobTitle', title: 'Job Title', align: '', type: 'String', sortable: true, collection: false}],
    ["coBranch", {fieldName: 'coBranch', title: 'CO Branch', align: '', type: 'String', sortable: true, collection: false}],
    ["email", {fieldName: 'email', title: 'Email', align: '', type: 'String', sortable: true, collection: false}],
    ["officePhone", {fieldName: 'officePhone', title: 'Office Phone', align: '', type: 'String', sortable: true, collection: false}],
    ["officeFax", {fieldName: 'officeFax', title: 'Office Fax', align: '', type: 'String', sortable: true, collection: false}],
    ["mobilePhone", {fieldName: 'mobilePhone', title: 'Mobile Phone', align: '', type: 'String', sortable: true, collection: false}],
    ["createdDate", {fieldName: 'createdDate', title: 'Created', align: '', type: 'Date', sortable: true, collection: false}],
    ["lastLogin", {fieldName: 'lastLogin', title: 'Last Login', align: '', type: 'Date', sortable: true, collection: false}],
  ]);

  resourceType: ResourceTypeModel = {
    resourceName: 'users', lookups: {}, keyField: 'email', defaultDisplayColumns: [], resourceAttributes: [
      {
        name: 'title', description: 'Title', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false
      },
      {
        name: 'status', description: 'Status', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false
      },
      {
        name: 'firstName', description: 'First Name', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false
      },
      {
        name: 'lastName', description: 'Last Name', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false
      },
      {
        name: 'jobTitle', description: 'Job Title', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false
      },
      {name: 'coBranch', description: 'CO Branch', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'email', description: 'Email', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'officePhone', description: 'Office Phone', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'officeFax', description: 'Office Fax', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'mobilePhone', description: 'Mobile Phone', type: 'String', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'createdDate', description: 'Created', type: 'Date', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
      {name: 'lastLogin', description: 'Last Login', type: 'Date', excludeFromGroupings: true, canSumOn: false,
        displayable: true, canSortOn: true, collection: false},
    ]};

  filterItems: FilterItem[] = [
    {displayName: 'Status', fieldName: 'title', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Title', fieldName: 'status', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'First Name', fieldName: 'firstName', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Last Name', fieldName: 'lastName', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Job Title', fieldName: 'jobTitle', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'CO Branch', fieldName: 'coBranch', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Email', fieldName: 'email', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Office Phone', fieldName: 'officePhone', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Office Fax', fieldName: 'officeFax', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Mobile Phone', fieldName: 'mobilePhone', visible: true, type: 'String', fieldValue: '', editing: false, collection: false},
    {displayName: 'Created', fieldName: 'createdDate', visible: true, type: 'Date', fieldValue: '', editing: false, collection: false},
    {displayName: 'Last Login', fieldName: 'lastLogin', visible: true, type: 'Date', fieldValue: '', editing: false, collection: false}
  ];

  dataSource = new MatTableDataSource<UserListModel>();

  noData = false;

  findModel = new FindModel ('','title,status,firstName,lastName,jobTitle,coBranch,email,officePhone,officeFax,mobilePhone,createdDate,lastLogin','firstName,asc',0, 15);
  resultModel = new ResultModel ([], 0, this.findModel);
  filter = '';
  selectedRow?: UserListModel;

  selection = new SelectionModel<UserListModel>(true, []);
  canExportSelected = false;

  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];

  constructor(private userRemoteService: UserRemoteService,
              private searchOpsService: SearchOpsService,
              public authenticationService: AuthenticationService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.refresh_token != null) {
      this.authenticationService.setRefreshToken(this.route.snapshot.queryParams.refresh_token);
    }
    this.loadList();
  }

  onAdd(): void  {
    this.router.navigate(['/home/user-edit'], {
      queryParams: {viewStatus: 'add'}
    });
  }

  onEdit(): void  {
    this.router.navigate(['/home/user-edit'], {
      queryParams: { viewStatus: 'edit'}
    });
  }

  onDelete(): void  {

  }

  loadList(): void  {
    this.userRemoteService.findUsers(this.findModel).subscribe(
        (users: any) => {
          this.dataSource.data = users.content;
          this.resultModel = users;
        }, (error: any) => {
        }
      );
  }

  doFilter(value: string): void {
    this.loadList();
  }

  exportPDFSelectedRecords(): void {
    console.log('export selected pdf');
  }

  exportXLSSelectedRecords(): void  {
    console.log('export selected xls');
  }

  exportPDFAllRecords(): void  {
  }

  exportXLSAllRecords(): void  {
    console.log('export all xls');
  }

  onFilterChanged(filter: string): void  {
    this.findModel.search = filter;
    this.loadList();
  }

  onColumnOrderingChanged($event: string[]): void  {

  }

  onSortChanged(sort: Sort): void  {
    this.loadList();
  }

  onHeaderActionSelected(action: string): void  {

  }

  onRowSelected(row: any): void  {
    this.selectedRow = row;
  }

  onSelectionsChanged(selections: SelectionModel<any>): void  {

  }

  onRowActionSelected(action: string): void  {

  }

  onPageChange(event: any): void  {
    this.findModel.page = event.pageIndex;
    this.findModel.size = event.pageSize;
    this.loadList();
  }

  onQuickSearchFilterChanged(values: FilterItemValues): void {
    this.findModel.search = values.filter;
    this.loadList();
  }
}
