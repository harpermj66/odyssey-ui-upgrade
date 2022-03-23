import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "../../../odyssey-service-library/src/lib/theme/theme.service";
import {ActivityService} from "../../../odyssey-service-library/src/lib/session/service/activity.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'odyssey-home';

  constructor(public authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              public themeService: ThemeService,
              private activityService: ActivityService) {
  }

  ngOnInit(): void {
    this.themeService.setThemeFromUrl(this.route);
    this.authenticationService.getUser().subscribe();
    this.subscribeToAuthenticationService();
  }

  ngOnDestroy(): void {
    if (this.authenticationService != null) {
      this.authenticationService.authenticationStatusChanged.unsubscribe();
    }
  }

  subscribeToAuthenticationService(): void {
    this.authenticationService.authenticationStatusChanged.subscribe(_ => {
      if (this.authenticationService.isAuthenticated()) {
        //this.router.navigate(['welcome']);
      } else {
        this.router.navigate(['cover-page']);
      }
    });
  }

  @HostListener('window:mousemove') @HostListener('window:mouseup') @HostListener('window:keyup') activity(): void {
    this.activityService.activity();
  }
}
