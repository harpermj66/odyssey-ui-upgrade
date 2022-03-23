import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {HelpService} from "../help/help.service";
import {
  CompanyType,
  CurrentUserService
} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {OdysseyLegacyService} from "../../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";

@Component({
  selector: 'lib-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit, AfterViewInit {

  @Output() toggleLeftSideBar = new EventEmitter<void>();

  @Output() signIn = new EventEmitter<void>();
  @Output() signedOut = new EventEmitter<void>();
  @Output() openMenuRequested = new EventEmitter<void>();

  @Input() company = '';
  @Input() drawerOpened = true;

  // tslint:disable-next-line:variable-name
  _name = '';

  authenticated = false;

  delayedDrawReady = false;

  private readonly userMenu = [
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

  constructor(public authenticationService: AuthenticationService,
              public themeService: ThemeService,
              public helpService: HelpService,
              private userService: CurrentUserService,
              private odysseyLegacyService: OdysseyLegacyService,
              private changeRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authenticationService.authenticationStatusChanged.subscribe(user => {
      this.setUserDetails(user);
    });
    if (this.authenticationService.isAuthenticated()) {
      this.authenticated = true;
      this.authenticationService.getUser().subscribe(user => {
        this.setUserDetails(user);
      });
    }
  }

  ngAfterViewInit(): void {
    // Need to delay rendering of components that reference other components withing their own view
    this.delayedDrawReady = true;
    this.changeRef.detectChanges();
  }

  @Input()
  set name(value: string) {
    this._name = value;
  }

  get name(): string {
    if (this.authenticationService.user != null) {
      this._name = this.authenticationService.user.firstName + ' ' + this.authenticationService.user.lastName;
    }
    return this._name;
  }

  setUserDetails(user: any): void {
    if (this.authenticationService.isAuthenticated()) {
      parent.name = user.firstName + ' ' + user.lastName;
      this.themeService.changeTheme(user.theme);
    }
  }

  onSignIn(): void {
    this.signIn.emit();
  }

  onSignOut(): void {
    this.authenticated = false;
    this.authenticationService.logout().subscribe(() => {
      // Wait for the logout to be processed
      this.signedOut.emit();
    });
  }

  onOpen(): void {
    this.openMenuRequested.emit();
  }

  onToggleLeftSideNavigator(): void {
    this.toggleLeftSideBar.emit();
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
