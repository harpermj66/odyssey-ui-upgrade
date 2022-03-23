import { Output } from '@angular/core';
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {SidebarMenuModel} from "../sidebar-menu.model";
import { getSidebarMode, SidebarMode } from "../../model/sidebar-mode";


@Component({
  selector: 'lib-sidebar-composite',
  templateUrl: './sidebar-composite.component.html',
  styleUrls: ['./sidebar-composite.component.scss']
})
export class SidebarCompositeComponent implements OnInit {
  readonly side = 'side';
  readonly over = 'over';

  @Output() mouseOverEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseOutEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() sidebarMenuChanged: EventEmitter<SidebarMenuModel> = new EventEmitter<SidebarMenuModel>();
  @Output() signedIn = new EventEmitter<void>();
  @Output() signedOut = new EventEmitter<void>();
  @Output() registerClicked = new EventEmitter<void>();

  @Input() sidebarMode: SidebarMode;


  _sideBarMenu: SidebarMenuModel[];

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set sideBarMenu(value: SidebarMenuModel[]) {
    this._sideBarMenu = value;
  }

  get sideBarMenu(): SidebarMenuModel[] {
    return this._sideBarMenu;
  }

  onMouseOver(): void {
    this.mouseOverEvent.emit();
    this.sidebarMode = getSidebarMode(this.over);
  }

  onMouseLeave(): void {
    this.mouseOutEvent.emit();
    this.sidebarMode = getSidebarMode(this.side);
  }

  onSidebarMenuChanged(menuModel: SidebarMenuModel): void {
    this.sidebarMenuChanged.emit(menuModel);
    this.sidebarMode = getSidebarMode(this.side);
  }

  signIn(): void {
      this.signedIn.emit();
  }

  onSignOut(): void {
      this.signedOut.emit();
  }

  emitRegisterClicked(): void {
    this.registerClicked.emit();
  }

}
