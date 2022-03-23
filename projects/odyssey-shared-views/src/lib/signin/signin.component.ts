import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {AuthenticationService} from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {AuthenticationRemoteService} from "../../../../odyssey-service-library/src/lib/authentication/authentication-remote.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {environment} from "../../../../odyssey-home/src/environments/environment";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  @Output() signedOut = new EventEmitter<void>();

  username = '';
  password = '';
  busy = false;
  canSignIn = false;
  error = '';
  showTermsAndConditions = false;

  redirectParams: any;
  customerPortalSignIn = false;

  constructor(private route: ActivatedRoute, private router: Router,
              public authenticationService: AuthenticationService,
              public themeService: ThemeService,
              private authenticationRemoteService: AuthenticationRemoteService,
              ) { }

  ngOnInit(): void {

    this.showTermsAndConditions = false;
    this.redirectParams = {};
    this.route.queryParamMap.forEach((paramMap: ParamMap) => {
      paramMap.keys.forEach((key: string) => {
        if(key === "application" && paramMap.get(key) === "customer-portal"){
          this.customerPortalSignIn = true;
        }
        this.redirectParams[key] = paramMap.get(key);
      });
    });

    this.refreshAuthenticationIfSignedIn();
  }

  refreshAuthenticationIfSignedIn(): void {
    if (this.authenticationService.refreshToken()) {
      // tslint:disable-next-line:max-line-length
      this.authenticationRemoteService.refresh(this.authenticationService.refreshToken()).subscribe(
        result => {
          if (result) {
            this.onAuthSuccess(result);
          }
        }, error => {
        });
    }
  }

  // tslint:disable-next-line:typedef
  setCanSignIn() {
    this.canSignIn = this.username.length > 0 && this.password.length > 0 && !this.busy;
  }

  onSignIn(): void {
    const endpoint = this.customerPortalSignIn ? "/customer-portal" : "";
    this.error = '';

    if (this.canSignIn) {
      this.busy = true;
      this.authenticationRemoteService.authenticate(this.username, this.password,
        this.themeService.getCurrentCarrier(), endpoint).subscribe(result => {
          this.busy = false;
          this.onAuthSuccess(result);
          // Temporary
          this.authenticationService.password = this.password;
        }, error => {
          this.busy = false;
          this.onAuthError(error);
      });
    }
  }

  // tslint:disable-next-line:typedef
  private onAuthSuccess(result: any) {
    const endpoint = this.customerPortalSignIn ? "/customer-portal" : "";
    this.error = '';
    this.authenticationService.authenticated(result, endpoint);
    this.authenticationService.getUser(endpoint).subscribe((user: any) => {
      this.themeService.changeTheme(user.theme);
      if (!user.termsAndConditionsAccepted) {
        this.showTermsAndConditions = true;
      } else {
        this.redirectToRequestedRoute();
      }

    }, error => {
      this.onAuthError(error);
    });
  }

  private redirectToRequestedRoute(): void {
    let redirectRoute = this.redirectParams && this.redirectParams.route ? this.redirectParams.route : 'welcome';
    delete this.redirectParams.route;
    if (redirectRoute === 'signin') {
      redirectRoute = 'welcome';
    }
    this.router.navigate(['/' + redirectRoute], {queryParams: this.redirectParams});
  }

  // tslint:disable-next-line:typedef
  private onAuthError(error: any) {
    if (error.error) {
      switch (error.error.status) {
        case 403: {
          this.error = 'Username, password combination not valid';
          break;
        }
        case 409: {
          this.error = 'Please log out of the existing session';
          break;
        }
        default: {
          this.error = 'Username, password combination not valid';
          break;
        }
      }
    }


    this.busy = false;
  }

  getErrorMsg(code: string): string {
    switch (code) {
      case 'Locked': {
        return 'User account is locked, please contact your administrator';
      }
      case 'Disabled': {
        return 'User account is disabled, please contact your administrator';
      }
      case 'NoRole': {
        return 'User has no role or entitlement, please contact your administrator';
      }
      case 'NotFound': {
        return 'User name cannot be found';
      }
      case 'Bad credentials': {
        return 'Incorrect username or password supplied';
      }
      default: {
        return code;
      }
    }
  }

  onAccept() {
    this.authenticationRemoteService.acceptTermsAndConditions().subscribe( result => {
      this.redirectToRequestedRoute();
    })
  }

  onDontAccept() {
    this.authenticationService.logout().subscribe(() => {
      // Wait for the logout to be processed
      this.signedOut.emit();
    });
  }

}
