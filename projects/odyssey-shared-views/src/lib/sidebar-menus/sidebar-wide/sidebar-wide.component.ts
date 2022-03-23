import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SidebarMenuModel, SubMenu} from "../sidebar-menu.model";
import {CurrentUserService} from "../../../../../odyssey-service-library/src/lib/authentication/current-user.service";


@Component({
  selector: 'lib-sidebar-wide',
  templateUrl: './sidebar-wide.component.html',
  styleUrls: ['./sidebar-wide.component.scss']
})
export class SidebarWideComponent implements OnInit {

  @Output() headerMenuChanged: EventEmitter<SidebarMenuModel> = new EventEmitter<SidebarMenuModel>();
  @Output() menuChanged: EventEmitter<SubMenu> = new EventEmitter<SubMenu>();

  menuLoaded = false;
  // tslint:disable-next-line:variable-name
 _menu: SidebarMenuModel[];

  constructor(
    private userService: CurrentUserService
  ) {}

  ngOnInit(): void {
  }

  @Input()
  set menu(value: SidebarMenuModel[]) {
    this.userService.loadOrGetUser().subscribe( (currentUser) => {
      if (!currentUser) { return; }
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
    });
  }

  private restrictSubMenus(submenu: SubMenu[]): SubMenu[] {
    return submenu.filter(it => this.userService.evalRestrictions(it.restrictions)).map(it => {
      it.menus = this.restrictSubMenus(it.menus);
      return it;
    });
  }

  onMenuChange(menuItem: SubMenu): void {
    this.menuChanged.emit(menuItem);
  }

  onHeaderClicked(menuItem: SidebarMenuModel): void {
    if (menuItem.menus.length === 0) {
      this.headerMenuChanged.emit(menuItem);
    }
  }
}
