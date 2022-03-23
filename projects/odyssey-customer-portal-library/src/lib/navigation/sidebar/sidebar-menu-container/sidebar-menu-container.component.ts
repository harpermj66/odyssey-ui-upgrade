import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  getSidebarMode,
  SidebarMode,
  SidebarState
} from "../../../../../../odyssey-shared-views/src/lib/model/sidebar-mode";
import { CurrentUserService } from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import { AuthenticationService } from "../../../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import { ThemeService } from "../../../../../../odyssey-service-library/src/lib/theme/theme.service";
import {
  SidebarMenuModel,
  SubMenu
} from "../../../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";

@Component({
  selector: 'lib-sidebar-menu-container',
  templateUrl: './sidebar-menu-container.component.html',
  styleUrls: ['./sidebar-menu-container.component.scss']
})
export class SidebarMenuContainerComponent implements OnInit {

  @Input() sidebarMode: SidebarMode;
  @Input() showExpandIcon = false;

  @Input() unauthenticatedMenu = false;
  @Output() signOutClicked = new EventEmitter<void>();
  @Output() signInClicked = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();
  @Output() showMenu = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<SidebarMenuModel>();

  authenticated = false;
  menuLoaded = false;
  _menuItems: SidebarMenuModel[];

  constructor(
      private userService: CurrentUserService,
      public authenticationService: AuthenticationService,
      public themeService: ThemeService
  ) {
    this.authenticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {}

  @Input()
  set menuItems(value: SidebarMenuModel[]) {
    this._menuItems = value;
    if (this.unauthenticatedMenu) {
      this.menuLoaded = true;
      return;
    }

    this.userService.loadOrGetUser().subscribe((currentUser) => {
      if (!currentUser) { return; }
      this._menuItems = this.restrictMenu(value);
      if (value) {
        this.menuLoaded = true;
      }
    });
  }

  get menuItems(): SidebarMenuModel[] {
    return this._menuItems;
  }

  private restrictMenu(model: SidebarMenuModel[]): SidebarMenuModel[] {
    return model.filter(it => this.userService.evalRestrictions(it.restrictions)).map(it => {
      it.menus = this.restrictSubMenus(it.menus);
      return it;
    });
  }

  private restrictSubMenus(submenu: SubMenu[]): SubMenu[] {
    return submenu.filter(it => this.userService.evalRestrictions(it.restrictions)).map(it => {
      it.menus = this.restrictSubMenus(it.menus);
      return it;
    });
  }

  emitProfileClicked(): void {
    this.profileClicked.emit();
  }

  emitSignInClicked(): void {
    this.signInClicked.emit();
  }

  emitSignOutClicked(): void {
    this.authenticationService.logout().subscribe(() => {
      // Wait for the logout to be processed
      this.authenticated = false;
      this.signOutClicked.emit();
    });
  }

  emitRegisterClicked(): void {
    this.registerClicked.emit();
  }

  emitMenuItem(menuItem: SidebarMenuModel): void {
    this.menuItemClicked.emit(menuItem);
  }

  sidebarClosed(): boolean {
    return this.sidebarMode.state === SidebarState.CLOSED;
  }

}
