import { Output, Input, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {SidebarMenuModel, SubMenu} from 'projects/odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Output() menuChanged: EventEmitter<SubMenu> = new EventEmitter<SubMenu>();
  @Output() mainMenuClosed: EventEmitter<void> = new EventEmitter<void>();

  @Input() menus: SidebarMenuModel;

  constructor() {

  }

  ngOnInit(): void {

  }

  onMenuChange(menuItem: SubMenu): void {
    this.menuChanged.emit(menuItem);
  }

  onCloseMenu() {
    this.mainMenuClosed.emit();
  }
}
