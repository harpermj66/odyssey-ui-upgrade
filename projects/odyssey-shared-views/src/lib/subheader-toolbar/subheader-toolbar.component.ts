import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModuleNavigatorService} from "../../../../odyssey-service-library/src/lib/module-navigation/module-navigator.service";
import {MenuEvent} from "../legacy-menu/legacy-menu.component";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {SubheaderToolbarService} from "./subheader-toolbar.service";

@Component({
  selector: 'lib-subheader-toolbar',
  templateUrl: './subheader-toolbar.component.html',
  styleUrls: ['./subheader-toolbar.component.scss']
})
export class SubheaderToolbarComponent implements OnInit {

  @Output() optionSelected = new EventEmitter<string>();
  @Output() menuChanged = new EventEmitter<MenuEvent>();

  @Output() homeClicked = new EventEmitter<void>();

  @Input() module = '';

  development = true;

  constructor(public moduleNavigatorService: ModuleNavigatorService,
              public themeService: ThemeService,
              public subHeaderToolbarService: SubheaderToolbarService) { }

  ngOnInit(): void {

  }

  openHome(): void {
    this.moduleNavigatorService.openHomeModule();
  }

  onMenuChanged(event: MenuEvent): void {
    // Just re-dispatch - avoiding dependencies on components
    this.menuChanged.emit(event);
  }

  onMenuChange(routeUrl: string, legacyView: boolean = true): void {
    const menu = new MenuEvent(legacyView, routeUrl);
    this.menuChanged.emit(menu);
  }

  onThemeChange(theme: string): void {
    this.themeService.changeTheme(theme);
  }

  onHome(): void {
    this.homeClicked.emit();
  }
}
