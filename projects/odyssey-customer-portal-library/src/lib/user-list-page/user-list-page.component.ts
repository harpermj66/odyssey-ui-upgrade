import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {User, UserStatus} from "../model/user";
import {UserListRemoteService} from "../service/user-list/user-list-remote.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {UserUpdateRemoteService} from "../service/user-update/user-update-remote.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {PermissionGroup} from "../model/permission-group";

@Component({
    selector: 'lib-user-list-page',
    templateUrl: './user-list-page.component.html',
    styleUrls: ['./user-list-page.component.css']
})
export class UserListPageComponent implements OnInit, AfterViewInit {

    @Output() editButtonClicked = new EventEmitter<User>();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    readonly ACTIVE = UserStatus.ACTIVE;
    readonly INACTIVE = UserStatus.INACTIVE;

    users: User[] = [];
    dataSource = new MatTableDataSource<User>(this.users);

    searchValue = "";
    loading = false;
    timeout: any;
    debounce = 500;

    columnsToDisplay = [
        "title",
        "status",
        "firstName",
        "lastName",
        "jobTitle",
        "email",
        "action"
    ];

    constructor(
        private _userListRemoteService: UserListRemoteService,
        private _userUpdateRemoteService: UserUpdateRemoteService,
        private _snackBar: MatSnackBar,
        private _dialog: MatDialog,
    ) {
        this.findUsers(0);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    findUsers(delay = this.debounce) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.loading = true;
            this._userListRemoteService.findUsers(this.searchValue).subscribe(
                (res) => {
                    this.users = res;
                    this.dataSource = new MatTableDataSource<User>(this.users);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.loading = false;
                },
                (error) => {
                    console.log(error);
                    this.loading = false;
                }
            );
        }, delay);
    }

    updateStatus(user: User): void{
        user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
        this.updateUser(user);
    }

    updateUser(user: User): void{
        this._userUpdateRemoteService.adminUpdateUser(user).subscribe(
            () => {
                this.openSnackBar("User updated successfully.");
            },
            error => {
                let message = "Unable to update user. Please try again or contact support.";
                if(error?.error?.message){
                    message = error.error.message;
                }
                this.openSnackBar(message);
            }
        );
    }

    openSnackBar(message: string, action = "Dismiss", duration = 5000): void {
        this._snackBar.open(message, action, { duration });
    }

    openDialog(user: User): void {
        const verb = user.status === UserStatus.ACTIVE ? "deactivate" : "activate";

        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            data: {
                title: "Confirm",
                message: `Are you sure you want to ${verb} this user?`,
                confirmButtonTitle: "Yes",
                cancelButtonTitle: "No",
            }
        });

        dialogRef.componentInstance.confirmClicked.subscribe(
            () => {
                this.updateStatus(user)
            }
        );

        dialogRef.afterClosed().subscribe(() => {
            dialogRef.componentInstance.confirmClicked.unsubscribe();
        });
    }

    emitEditButtonClicked(user: User): void {
        console.log("emitted user", user);
        this.editButtonClicked.emit(user);
    }
}
