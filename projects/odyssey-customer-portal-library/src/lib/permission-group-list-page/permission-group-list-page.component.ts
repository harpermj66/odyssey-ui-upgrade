import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PermissionGroup} from "../model/permission-group";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PermissionGroupRemoteService} from "../service/permission-group/permission-group-remote.service";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {CompanyRemoteService} from "../service/company/company-remote.service";
import { SnackbarMessage } from "../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'lib-permission-group-list-page',
  templateUrl: './permission-group-list-page.component.html',
  styleUrls: ['./permission-group-list-page.component.css']
})
export class PermissionGroupListPageComponent implements OnInit, AfterViewInit {

  @Output() editButtonClicked = new EventEmitter<PermissionGroup>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  currentUser: CurrentUser;
  currentCompanyId: number;

  searchValue = "";
  loading = false;
  awaitingResponse = false;
  timeout: any;
  debounce = 500;

  permissionGroups: PermissionGroup[] = [];
  dataSource = new MatTableDataSource<PermissionGroup>(this.permissionGroups);

  columnsToDisplay = [
      "displayName",
      "description",
      "roles",
      "action"
  ];

  constructor(
      private _companyRemoteService: CompanyRemoteService,
      private _permissionGroupRemoteService: PermissionGroupRemoteService,
      private _snackBar: MatSnackBar,
      private _dialog: MatDialog,
      private _userService: CurrentUserService,
  ) {
    this.currentUser = this._userService.user!!;
    this.currentCompanyId = this.currentUser.company?.companyId!!;
    this.findPermissionGroups(0);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  findPermissionGroups(delay = this.debounce): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.loading = true;
      this._permissionGroupRemoteService.findPermissionGroupsByCompanyId(this.currentCompanyId, this.searchValue)
          .subscribe(
          res => {
            this.permissionGroups = res;
            this.dataSource = new MatTableDataSource<PermissionGroup>(this.permissionGroups);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          error => {
            this.loading = false;
            SnackbarMessage.showGeneralErrorMessage(this._snackBar, "Failed to retrieve permission groups.");
          }
      );
    }, delay);
  }

  emitEditButtonClicked(permissionGroup: PermissionGroup): void {
      this.editButtonClicked.emit(permissionGroup);
  }

  deletePermissionGroup(permissionGroup: PermissionGroup): void {
    this.awaitingResponse = true;
    this._permissionGroupRemoteService.deletePermissionGroup(this.currentCompanyId, permissionGroup.name)
        .subscribe(
            res => {
              this.awaitingResponse = false;
              const index = this.permissionGroups.indexOf(permissionGroup);
              this.permissionGroups.splice(index, 1);
              this.dataSource = new MatTableDataSource<PermissionGroup>(this.permissionGroups);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              SnackbarMessage.showGeneralMessage(this._snackBar, `${permissionGroup.displayName} was deleted successfully.`);
            },
            error => {
              let message = "Unable to delete permission group.";
              if(error?.error?.message){
                message = error.error.message;
              }
              this.awaitingResponse = false;
              SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
            }
        );
  }

  openDialog(permissionGroup: PermissionGroup): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: `Are you sure you want to delete ${permissionGroup.displayName}?`,
        confirmButtonTitle: "Yes",
        cancelButtonTitle: "No",
      }
    });

    dialogRef.componentInstance.confirmClicked.subscribe(
        () => {
          this.deletePermissionGroup(permissionGroup);
        }
    );

    dialogRef.afterClosed().subscribe(() => {
      dialogRef.componentInstance.confirmClicked.unsubscribe();
    });
  }

}
