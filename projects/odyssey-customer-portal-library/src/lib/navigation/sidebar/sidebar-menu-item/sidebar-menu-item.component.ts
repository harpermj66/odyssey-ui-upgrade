import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  SidebarMenuModel,
  SubMenu
} from "../../../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";
import { SidebarMode, SidebarState } from "../../../../../../odyssey-shared-views/src/lib/model/sidebar-mode";

@Component({
  selector: 'lib-sidebar-menu-item',
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.css']
})
export class SidebarMenuItemComponent implements OnInit {

  @Input() sidebarMode: SidebarMode;
  @Input() menuItem: SidebarMenuModel;

  @Output() menuItemClicked = new EventEmitter<SidebarMenuModel>();

  authenticated = false;

  constructor() {}

  ngOnInit(): void {}

  emitMenuItem(menuItem: SidebarMenuModel): void {
    this.menuItemClicked.emit(menuItem);
  }

  sidebarClosed(): boolean {
    return this.sidebarMode.state === SidebarState.CLOSED;
  }
}
