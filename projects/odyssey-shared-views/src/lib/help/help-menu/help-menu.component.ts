import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {HelpItemSelectedEvent, HelpService} from "../help.service";
import {HelpMenuItem} from "../help.model";
import {MatMenu} from "@angular/material/menu";

@Component({
  selector: 'lib-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.css']
})
export class HelpMenuComponent implements OnInit, AfterViewInit {

  @Input() public rootTitle: string;
  @Input() public menuModel?: HelpMenuItem;

  @ViewChild(MatMenu) public helpMenu: MatMenu;

  delayedDrawReady = false;

  constructor(
      public helpService: HelpService,
      private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    if (!this.menuModel) {
      this.menuModel = this.helpService.getModelForRoot(this.rootTitle);
    }
  }

  ngAfterViewInit(): void {
    // Need to delay rendering of components that reference other components withing their own view
    this.delayedDrawReady = true;
    this.changeRef.detectChanges();
  }

  helpItemSelected(event: HelpMenuItem): void {
    this.helpService.handleHelpItemSelect(event as HelpItemSelectedEvent);
  }
}
