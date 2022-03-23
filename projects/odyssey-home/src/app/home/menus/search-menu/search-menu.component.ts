import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  SidebarMenuModel,
  SubMenu
} from "../../../../../../odyssey-shared-views/src/lib/sidebar-menus/sidebar-menu.model";

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss']
})
export class SearchMenuComponent implements OnInit {

  @Output() menuChanged: EventEmitter<SubMenu> = new EventEmitter<SubMenu>();

  @Input() menus: SidebarMenuModel;

  constructor() {

  }

  ngOnInit(): void {

  }

  onMenuChange(menuItem: SubMenu): void {
    this.menuChanged.emit(menuItem);
  }

}
