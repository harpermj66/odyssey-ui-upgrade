import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SidebarMenuModel, SubMenu} from "../sidebar-menu.model";
import {
  CompanyType,
  CurrentUserService
} from "../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {
  AuthenticationService
} from "../../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ThemeService} from "../../../../../odyssey-service-library/src/lib/theme/theme.service";
import {SidebarMode, SidebarState} from "../../model/sidebar-mode";
import {OdysseyLegacyService} from "../../../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";

@Component({
  selector: 'lib-sidebar-icon',
  templateUrl: './sidebar-icon.component.html',
  styleUrls: ['./sidebar-icon.component.scss']
})
export class SidebarIconComponent implements OnInit, AfterViewInit {

  @Input() sidebarMode: SidebarMode;
  @Input() showExpandIcon = true;

  @Input() unauthenticatedMenu = false;
  @Output() signedOut = new EventEmitter<void>();
  @Output() signedIn = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();
  @Output() showMenu = new EventEmitter<void>();
  @Output() menuChanged: EventEmitter<SidebarMenuModel> = new EventEmitter<SidebarMenuModel>();

  authenticated = false;

  menuLoaded = false;
  // tslint:disable-next-line:variable-name
  _menu: SidebarMenuModel[];

  private readonly userMenu =  [
    {
      title: 'Edit Profile',
      abbr: 'muplId',
      icon: 'edit'
    },
    {
      title: 'Manage Tasks',
      abbr: 'mutlId',
      icon: 'task'
    },
    {
      title: 'Private Email Templates',
      abbr: 'mamPrivEmailTempId',
      icon: 'drafts',
      restrictions: [{
        roles: ["ADMIN"],
        companyTypesAllowed: [CompanyType.CARRIER, CompanyType.AGENT],
        companyPreferences: ["fullAccess"]
      }]
    }
  ];

  delayedDrawReady = false;

  constructor(
      private userService: CurrentUserService,
      public authenticationService: AuthenticationService,
      public themeService: ThemeService,
      private odysseyLegacyService: OdysseyLegacyService,
      private changeRef: ChangeDetectorRef
  ) {
    this.authenticated = authenticationService.isAuthenticated();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Need to delay rendering of components that reference other components withing their own view
    this.delayedDrawReady = true;
    this.changeRef.detectChanges();
  }

  @Input()
  set menu(value: SidebarMenuModel[]) {
    this._menu = value;
    if (this.unauthenticatedMenu) {
      this.menuLoaded = true;
      return;
    }

    this.userService.loadOrGetUser().subscribe((currentUser) => {
      if (!currentUser) {
        return;
      }
      this._menu = this.restrictMenu(value);
      if (value) {
        this.menuLoaded = true;
      }
    });
  }

  get menu(): SidebarMenuModel[] {
    return this._menu;
  }

  private restrictMenu(model: SidebarMenuModel[]): SidebarMenuModel[] {
    return model.filter(it => this.userService.evalRestrictions(it.restrictions)).map(it => {
      it.menus = this.restrictSubMenus(it.menus);
      return it;
    }).filter(it => {
      it.menus = SubMenu.trimEmptyMenus(it.menus);
      return SidebarMenuModel.notEmpty(it);
    });
  }

  private restrictSubMenus(submenu: SubMenu[]): SubMenu[] {
    return submenu.filter(it => this.userService.evalRestrictions(it.restrictions)).map(it => {
      it.menus = this.restrictSubMenus(it.menus);
      return it;
    });
  }

  onMenuChange(menuItem: SidebarMenuModel): void {
    this.menuChanged.emit(menuItem);
  }

  onSignOut(): void {
    this.authenticationService.logout().subscribe(() => {
      // Wait for the logout to be processed
      this.signedOut.emit();
    });
  }

  signIn(): void {
      this.signedIn.emit();
  }

  emitRegisterClicked(): void {
    this.registerClicked.emit();
  }

  onShowMenu(): void {
      this.showMenu.emit();
  }

  isSidebarClosed(): boolean {
      return this.sidebarMode.state === SidebarState.CLOSED;
  }

  avatar(): string | null {
    const usr = this.userService.user;
    return usr && usr.avatar && usr.avatar.trim() !== '' ? usr.avatar : null;
  }

  userMenuItems(): {title: string, abbr: string, icon: string}[] {
    return this.userMenu.filter(item => this.userService.evalRestrictions(item.restrictions));
  }

  onUserMenuItemClick(item: {title: string, abbr: string}): void {
    this.odysseyLegacyService.changeMenu(item.abbr);
  }
}
