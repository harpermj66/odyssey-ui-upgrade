import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {PermissionGroupRemoteService} from "../service/permission-group/permission-group-remote.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompanyRemoteService} from "../service/company/company-remote.service";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {User} from "../model/user";
import {PermissionGroup} from "../model/permission-group";
import {Role} from "../model/role";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {RoleRemoteService} from "../service/role/role-remote.service";
import {UserListRemoteService} from "../service/user-list/user-list-remote.service";
import { SnackbarMessage } from "../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {PermissionGroupWrapper} from "../model/permission-group-wrapper";


@Component({
  selector: 'lib-permission-group-creation-page',
  templateUrl: './permission-group-creation-page.component.html',
  styleUrls: ['./permission-group-creation-page.component.css']
})
export class PermissionGroupCreationPageComponent implements OnInit, OnDestroy {

  @Output() permissionGroupCreationCancelled = new EventEmitter<void>();

  @Input() permissionGroupToEdit?: PermissionGroup;

  currentUser: CurrentUser;
  currentCompanyId: number;

  permissionGroupCreationForm: FormGroup;
  permissionGroupWrapper = new PermissionGroupWrapper();
  newPermissionGroup = new PermissionGroup();
  roles: Role[] = [];
  selectedRoles: Role[] = [];
  users: User[] = [];
  selectedUsers: User[] = [];
  awaitingResponse = false;


  constructor(
      private _formBuilder: FormBuilder,
      private _permissionGroupRemoteService: PermissionGroupRemoteService,
      private _companyRemoteService: CompanyRemoteService,
      private _roleRemoteService: RoleRemoteService,
      private _userService: CurrentUserService,
      private _userListRemoteService: UserListRemoteService,
      private _snackBar: MatSnackBar,
      private _dialog: MatDialog,
  ) {
    this.currentUser = this._userService.user!!;
    this.currentCompanyId = this.currentUser.company?.companyId!!;
    this.getRoles();
    this.getActiveUsers();
  }

  ngOnInit(): void {
    this.permissionGroupCreationForm = this._formBuilder.group({
      displayName: [this.permissionGroupToEdit ? this.permissionGroupToEdit.displayName : '', Validators.pattern("^[a-zA-Z ]*\$")],
      description: [this.permissionGroupToEdit ? this.permissionGroupToEdit.description : '', Validators.required],
    });

    this.permissionGroupToEdit && this.selectedRoles.push(...this.permissionGroupToEdit.roles);
    this.permissionGroupToEdit && this.selectedUsers.push(...this.permissionGroupToEdit.users);
  }

  ngOnDestroy(): void {
    this.permissionGroupToEdit = undefined;
  }

  submitForm(): void {
    this.awaitingResponse = true;
    this.newPermissionGroup.displayName = this.permissionGroupCreationForm.get("displayName")?.value;
    this.newPermissionGroup.description = this.permissionGroupCreationForm.get("description")?.value;
    this.newPermissionGroup.roles = this.selectedRoles;
    this.newPermissionGroup.users = this.selectedUsers;
    this.newPermissionGroup.odysseyCompanyId = this.currentCompanyId;

    if(this.permissionGroupToEdit){
      this.permissionGroupWrapper.currentPermissionGroup = this.permissionGroupToEdit;
      this.permissionGroupWrapper.updatedPermissionGroup = this.newPermissionGroup;
      this.updatePermissionGroup();
    } else {
      this.createPermissionGroup();
    }
  }

  handleRoleSelection(event: MatCheckboxChange, role: Role): void {
    if(event.checked){
      this.selectedRoles.push(role);
    } else {
      const index = this.selectedRoles.indexOf(role);
      this.selectedRoles.splice(index, 1);
    }
  }

  handleUserSelection(event: MatCheckboxChange, user: User): void {
    if(event.checked){
      this.selectedUsers.push(user);
    } else {
      const index = this.selectedUsers.indexOf(user);
      this.selectedUsers.splice(index, 1);
    }
  }

  getRoles(): void {
    this._roleRemoteService.findRoles().subscribe(
        res => {
          this.roles = res;

          this.roles.forEach(role => {
            this.selectedRoles.forEach(selectedRole => {
              if(role.name === selectedRole.name){
                role.checked = true;
              }
            });
          });
        },
        error => {
          let message = "Unable to retrieve roles.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
        }
    );
  }

  getActiveUsers(): void {
    this._userListRemoteService.findActiveUsers().subscribe(
        res => {
          this.users = res;

          this.users.forEach(user => {
            this.selectedUsers.forEach(selectedUser => {
              if(user.email === selectedUser.email){
                user.checked = true;
              }
            });
          });
        },
        error => {
          let message = "Unable to retrieve users.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
        }
    );
  }

  createPermissionGroup(): void{
    this._permissionGroupRemoteService.addPermissionGroup(this.newPermissionGroup).subscribe(
        res => {
          this.awaitingResponse = false;
          SnackbarMessage.showGeneralMessage(this._snackBar, "Permission Group created successfully.");
        },
        error => {
          this.awaitingResponse = false;
          let message = "Unable to create permission group.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
        }
    );
  }

  updatePermissionGroup(): void{
    this._permissionGroupRemoteService.updatePermissionGroup(this.permissionGroupWrapper).subscribe(
        res => {
          this.awaitingResponse = false;
          this.permissionGroupToEdit!!.roles = [];
          this.permissionGroupToEdit!!.roles.push(...this.newPermissionGroup.roles);
          this.permissionGroupToEdit!!.users = [];
          this.permissionGroupToEdit!!.users.push(...this.newPermissionGroup.users);
          this.permissionGroupToEdit!!.displayName = this.newPermissionGroup.displayName;
          this.permissionGroupToEdit!!.name = this.newPermissionGroup.name;
          this.permissionGroupToEdit!!.description = this.newPermissionGroup.description;

          SnackbarMessage.showGeneralMessage(this._snackBar, "Permission Group updated successfully.");
        },
        error => {
          this.awaitingResponse = false;
          let message = "Unable to update permission group.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
        }
    );
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: "Are you sure you want to cancel permission group creation?",
        confirmButtonTitle: "OK",
        cancelButtonTitle: "Cancel",
      }
    });

    dialogRef.componentInstance.confirmClicked.subscribe(
        () => {
          this.emitPermissionGroupCreationCancelled();
        }
    );

    dialogRef.afterClosed().subscribe(() => {
      dialogRef.componentInstance.confirmClicked.unsubscribe();
    });
  }

  emitPermissionGroupCreationCancelled(): void {
    this.permissionGroupCreationCancelled.emit();
  }

}
