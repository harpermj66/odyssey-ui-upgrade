import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthenticationService} from "../authentication/authentication.service";
import {AuthenticationRemoteService} from "../authentication/authentication-remote.service";

@Injectable()
export class StandardRequestInterceptor implements HttpInterceptor {
  readonly authErrorCodes = ['Locked', 'Disabled', 'NoRole', 'NotFound'];

  constructor(private authenticationService: AuthenticationService,
              private authenticationRemoteService: AuthenticationRemoteService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.handleAccess(request, next).pipe(
      catchError((error, caught) => {

        if (error.status === 419 || error.status === 401 || error.status === 0 ||
          (error.error && error.error.error_description && this.authErrorCodes.indexOf(error.error.error_description) > -1)) {

          const refreshToken = this.authenticationService.refreshToken();
          if (refreshToken.length > 0) {

            return this.authenticationRemoteService.refresh(this.authenticationService.refreshToken()).pipe(
              catchError(err => {
                this.expireAuth();
                throwError(err);
                return of(null);
              })).pipe(switchMap(response => {
              this.authenticationService.authenticated(response);
              if (this.isAuthRequest(request)) {
                // The response is a new token response so do not retry old request
                return response;
              } else {
                // retry failed request with new auth.
                return this.handleAccess(request, next);
              }

            }));

          } else {
            this.expireAuth();
            return throwError(error);
          }

        } else if (error.status === 402) {
          this.authenticationService.licenseExpired = true;
        }

        return throwError(error);

      })) as any;
  }

  private licenseExpired(): Observable<null> {
    this.authenticationService.authenticationExpire().subscribe(() => {
      this.redirectToLicenseExpired();
    });
    return of(null);
  }

  private redirectToLicenseExpired(): void {
    this.router.navigate(['licenseExpired']);
  }

  private expireAuth(): Observable<null> {
    // logout users, redirect to login page
    this.authenticationService.authenticationExpire().subscribe(() => {
      this.redirectToAuth();
    });
    return of(null);
  }

  private redirectToAuth(): void {
    const params: { [key: string]: string } = {};
    const route = this.route.snapshot;
    route.queryParamMap.keys.forEach((key: string) => {
      params[key] = route.queryParamMap.get(key) as string;
    });

    if (!params.route) {
      let path = window.location.hash;
      if (!path) {
        path = window.location.pathname;
      }

      if (path.startsWith('#')) {
        path = path.substring(1);
      }

      if (path.startsWith('/')) {
        path = path.substring(1);
      }

      // Make sure we don't included query params in the url
      const queryParamIndex = path.indexOf('?');
      if (queryParamIndex >= 0) {
        path = path.substring(0, queryParamIndex);
      }

      params.route = path;
    }


    this.router.navigate(['/signIn'], {queryParams: params});
  }

  handleAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authenticationService.accessToken();

    let changedRequest = request;

    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      // @ts-ignore
      headerSettings[key] = request.headers.getAll(key);
    }

    if (token && !this.isAuthRequest(request)) {
      headerSettings.Authorization = 'Bearer ' + token;
    }

    const newHeader = new HttpHeaders(headerSettings);

    changedRequest = request.clone({
      headers: newHeader
    });
    return next.handle(changedRequest);
  }

  private isAuthRequest(request: HttpRequest<any>): boolean {
    return request.url.split('?')[0] === AuthenticationRemoteService.URL_AUTH;
  }
}
