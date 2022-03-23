import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  SidebarMenuModel,
  SubMenu
} from "../../../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";
import {
  getSidebarMode,
  SidebarMode,
  SidebarState
} from "../../../../../../odyssey-shared-views/src/lib/model/sidebar-mode";

@Component({
  selector: 'lib-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.scss']
})
export class SidebarContainerComponent implements OnInit {

  readonly side = 'side';
  readonly over = 'over';

  @Input() sidebarMode: SidebarMode;
  @Input() currentWidth: number;
  @Input() showExpandIcon = false;

  @Output() mouseOverEvent = new EventEmitter<void>();
  @Output() mouseOutEvent = new EventEmitter<void>();
  @Output() menuItemClicked = new EventEmitter<SidebarMenuModel>();
  @Output() signInClicked = new EventEmitter<void>();
  @Output() signOutClicked = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();
  @Output() profileClicked = new EventEmitter<void>();


  _menuItems: SidebarMenuModel[];


  constructor() {}

  ngOnInit(): void {}

  emitMouseOverEvent(): void {
    this.mouseOverEvent.emit();
    this.sidebarMode = getSidebarMode(this.over);
  }

  emitMouseLeaveEvent(): void {
    this.mouseOutEvent.emit();
    this.sidebarMode = getSidebarMode(this.side);
  }

  emitMenuItem(menuModel: SidebarMenuModel): void {
    this.menuItemClicked.emit(menuModel);
    this.sidebarMode = getSidebarMode(this.side);
  }

  @Input()
  set menuItems(value: SidebarMenuModel[]) {
    this._menuItems = value;
  }

  get menuItems(): SidebarMenuModel[] {
    return this._menuItems;
  }

  emitProfileClicked(): void {
    this.profileClicked.emit();
  }

  emitSignInClicked(): void {
    this.signInClicked.emit();
  }

  emitSignOutClicked(): void {
    this.signOutClicked.emit()
  }

  emitRegisterClicked(): void {
    this.registerClicked.emit();
  }

}
