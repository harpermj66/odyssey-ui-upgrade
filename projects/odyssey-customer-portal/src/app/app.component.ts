import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'odyssey-customer-portal';

  constructor(public authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              public themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeService.setThemeFromUrl(this.route);
    this.authenticationService.getUser("/customer-portal").subscribe();
    this.subscribeToAuthenticationService();
  }

  ngOnDestroy(): void {
    if (this.authenticationService != null) {
      this.authenticationService.authenticationStatusChanged.unsubscribe();
    }
  }

  subscribeToAuthenticationService(): void {
    // this.authenticationService.authenticationStatusChanged.subscribe(user => {
    //   if (this.authenticationService.isAuthenticated()) {
    //     this.router.navigate(['home']);
    //   } else {
    //     this.router.navigate(['welcome']);
    //   }
    // });
  }

}
