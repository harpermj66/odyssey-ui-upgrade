import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'lib-header-toolbar-home',
  templateUrl: './header-toolbar-home.component.html',
  styleUrls: ['./header-toolbar-home.component.scss']
})
export class HeaderToolbarHomeComponent implements OnInit {

  @Output() goHome = new EventEmitter<void>();

  @Input() viewState = '';

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
  }

  onHome(): void  {
    this.goHome.emit();
  }

}
