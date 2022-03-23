import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subject, throwError} from "rxjs";
import {AuthenticationRemoteService} from "./authentication-remote.service";
import {ThemeService} from "../theme/theme.service";
import {catchError, delay, map, share} from "rxjs/operators";
import {OdysseyLegacyService} from "../../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";
import {CompanyDto} from "../model/company-dto";

export class AuthenticatedUser {
  id = -1;
  title = '';
  firstName = '';
  lastName = '';
  email = '';
  theme = '';
  avatar?: string;
  companyType = '';
  rolesList: string[] = [];
  carrierRolesList: string[] = [];
  companyPreferencesMap: object;
  carrierPreferencesMap: object;
  environmentVariablesMap: object;
  // tslint:disable-next-line:variable-name
  refresh_token = '';
  company?: CompanyDto;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {

  private readonly millisInDay = 24 * 60 * 60 * 1000;

  private readonly cookieRefresh = 'refresh_token';
  private readonly cookieAccess = 'access_token';

  /**
   * The last returned auth result,
   * should be cleared on logout.
   * @private
   */
  private authResult: any;

  /**
   * The last returned JSESSIONID for the odyssey instance,
   * should be cleared on logout.
   * @private
   */
  private legacySessionId: any;

  licenseExpired = false;
  user?: AuthenticatedUser;

  /**
   * Called when a user logs in or out.
   */
  authenticationStatusChanged = new Subject<AuthenticatedUser>();

  /**
   * Called when the auth user object changes, could be on a refresh of the user profile or on a log in or log out.
   */
  authUserChanged = new Subject<AuthenticatedUser>();

  tokenChange = new Subject<string>();
  injectedAccessToken = '';
  injectedRefreshToken = '';
  // Temporary
  password = '';

  /**
   * How long refresh tokens can be used for.
   * Will be updated on log in.
   */
  public sessionTimeoutMillis = 1800000;

  /**
   * A shared observable of the user currently being loaded, so multiple subscriptions can be fed by it
   * preventing us duplicating requests.
   * @private
   */
  private loadingUserObservable?: Observable<AuthenticatedUser | undefined>;

  constructor(private authenticationRemoteService: AuthenticationRemoteService,
              private themeService: ThemeService,
              private legacyService: OdysseyLegacyService) {
  }

  ngOnDestroy(): void {
    if (this.authenticationStatusChanged != null) {
      this.authenticationStatusChanged.unsubscribe();
    }
  }

  logout(): Observable<null> {
    return this.authenticationExpire();
  }

  private setUser(user: AuthenticatedUser): void {
    const change = this.user?.email !== user?.email;
    this.user = user;
    if (change) {
      this.authenticationStatusChanged.next(this.user);
    }
    this.authUserChanged.next(this.user);
  }

  /**
   * Get the currently logged in user.
   */
  getUser(endpoint = ""): Observable<AuthenticatedUser | undefined> {
    if (this.isAuthenticated()) {
      if (this.user) {
        // Use cached value
        return of(this.user);
      } else if (!this.loadingUserObservable) {
        // No value currently loading to start loading one.
        // Create a shared observable so we do not end up with multiple requests for the same user
        // if many request it at the same time
        this.loadingUserObservable = this.getLoadUserObservable(endpoint);
        return this.loadingUserObservable;
      } else {
        // Already have a request on-going so let them use the shared one
        return this.loadingUserObservable;
      }
    } else {
      // We are not logged in so any user loading request is invalid so clear the shared observable
      delete this.loadingUserObservable;
      return of(undefined);
    }
  }

  /**
   * Refresh the currently logged in user from the remote service. Does nothing if not logged in.
   */
  refreshUser(): void {
    if (this.isAuthenticated()) {
      const obs = this.getLoadUserObservable();
      this.loadingUserObservable = obs;
      obs.subscribe();
    }
  }

  private getLoadUserObservable(endpoint = ""): Observable<AuthenticatedUser | undefined> {
    const obs = this.authenticationRemoteService.loadUser(endpoint)
      .pipe(
        map((user: any) => {
          let authUser: AuthenticatedUser | undefined;
          if (this.isAuthenticated() && this.loadingUserObservable === obs) {
            // only use the return value if we haven't been logged out during the request
            // and a new user has not been loaded (started to be loaded)
            this.setUser(user as AuthenticatedUser);
            this.themeService.changeTheme(user.theme);

            authUser = user as AuthenticatedUser;
          }

          // Clear the observable for when we need to load a different user.
          delete this.loadingUserObservable;
          return authUser;
        }),
        catchError(error => {
          console.error('Failed to load user');
          delete this.loadingUserObservable;
          return throwError(error);
        }),
        share()
      );

    return obs;
  }

  setAccessToken(token: string): void {
    this.injectedAccessToken = token;
  }

  setRefreshToken(token: string): void {
    this.injectedRefreshToken = token;
  }

  accessToken(): string | undefined {
    return this.authResult != null ? this.authResult.access_token : (this.injectedAccessToken.length > 0 ? this.injectedAccessToken : null);
  }

  authenticated(authResult: any, endpoint = ""): void {
    if (authResult) {
      authResult.isAuthenticated = true;
      this.authResult = authResult;
      if (authResult) {
        const refreshTimeoutSeconds = this.authResult.refresh_expires_in;
        if (refreshTimeoutSeconds && typeof refreshTimeoutSeconds === 'number') {
          this.sessionTimeoutMillis = refreshTimeoutSeconds * 1000;
        }

        this.legacyService.accessToken = this.authResult.access_token;
        this.setCookie(authResult.refresh_token, new Date(Date.now() + this.sessionTimeoutMillis));

        // Load the user
        this.getUser(endpoint).subscribe();
      }
      this.tokenChange.next(this.accessToken());
    }
  }

  refreshToken(): string {
    if (this.authResult && this.authResult.refresh_token) {
      return this.authResult.refresh_token;
    } else if (this.injectedRefreshToken.length > 0) {
      return this.injectedRefreshToken;
    } else {
      return this.getCookie(this.cookieRefresh);
    }
  }

  isAuthenticated(): boolean {
    return this.refreshToken() != null && this.refreshToken().length !== 0;
  }

  authenticationExpire(): Observable<null> {
    this.clearCookies();
    this.authenticationRemoteService.delCurrentCarrier();
    this.legacyService.logout();

    // Give the legacy odyssey time to log out
    const obs = of(null).pipe(
      delay(1000),
      map(() => {
        this.authResult = null;
        this.legacySessionId = undefined;
        this.user = undefined;
        this.authenticationStatusChanged.next(undefined);
        // Clear the observable so we know any ongoing request for a user is no longer valid
        delete this.loadingUserObservable;
        return null;
      }),
      share()
    );

    obs.subscribe();

    return obs;
  }

  private getCookie(cookieName: string): string {
    let cookie= '';

    const name = cookieName + '=';

    const cookies = document.cookie.split(';');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cookies.length; i++) {
      let currentCookie = cookies[i];
      while (currentCookie.charAt(0) === ' ') {
        currentCookie = currentCookie.substring(1);
      }
      if (currentCookie.indexOf(name) === 0) {
        cookie = currentCookie.substring(name.length, currentCookie.length);
        break;
      }
    }

    return cookie;
  }

  private setCookie(refreshToken: string, expiry: Date): void {
    document.cookie = this.cookieRefresh + '=' + refreshToken
      + ';expires=' + expiry.toUTCString()
      + ';path=/;domain=' + window.location.hostname;
  }

  private clearCookies(): void {
    // Make tokens expired
    const expiry = new Date(Date.now() - 10000);
    document.cookie = this.cookieRefresh + '=;expires=' + expiry.toUTCString() + ';path=/;domain=' + window.location.hostname;
  }
}
