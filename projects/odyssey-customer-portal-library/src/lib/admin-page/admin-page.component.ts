import { Component, OnInit } from '@angular/core';
import {PermissionGroup} from "../model/permission-group";
import {User} from "../model/user";

@Component({
  selector: 'lib-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  showUserCreation = false;
  showPermissionGroupCreation = false;
  permissionGroupToEdit?: PermissionGroup;
  userToEdit?: User;

  constructor() {}

  ngOnInit(): void {}

  showUserCreationPage(): void {
    this.showUserCreation = true;
  }

  showUserListPage(): void {
    this.userToEdit = undefined;
    this.showUserCreation = false;
  }

  showPermissionGroupCreationPage(): void {
    this.showPermissionGroupCreation = true;
  }

  showPermissionGroupListPage(): void {
    this.permissionGroupToEdit = undefined;
    this.showPermissionGroupCreation = false;
  }

  setPermissionGroupToEdit(permissionGroup: PermissionGroup){
    this.permissionGroupToEdit = permissionGroup;
    this.showPermissionGroupCreationPage();
  }

  setUserToEdit(user: User){
    this.userToEdit = user;
    this.showUserCreationPage();
  }

}
