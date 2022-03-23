import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'lib-welcome-page-toolbar',
  templateUrl: './welcome-page-toolbar.component.html',
  styleUrls: ['./welcome-page-toolbar.component.scss']
})
export class WelcomePageToolbarComponent implements OnInit {

  @Output() requestSignIn = new EventEmitter<void>();

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
  }

  onSignIn(): void {
    this.requestSignIn.emit();
  }
}
