import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize, share} from "rxjs/operators";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationRemoteService {

  public static readonly STANDARD_LOGIN = 'odyssey-keycloak-service/auth/login';
  public static readonly URL_AUTH = 'odyssey-keycloak-service/auth/refresh';
  public static readonly MY_USER = 'odyssey-keycloak-service/api/user/myuser';
  public static readonly REFRESH_TOKEN = 'odyssey-keycloak-service/auth/route';
  public static readonly DEL_CURRENT_CARRIER = 'odyssey-keycloak-service/current-carrier';
  public static readonly ACCEPT_TERMS_AND_CONDITIONS = 'odyssey-keycloak-service/api/user/accepttandc';

  public refreshTokenLoading = false;
  private refreshRequest?: Observable<any>;

  private username = '';

  public loginLoading = false;

  constructor(private http: HttpClient) { }

  authenticate(
      username: string,
      password: string,
      carrier: string = '',
      endpoint = '',
  ): Observable<any> {

    this.loginLoading = true;
    this.username = username;

    const params = {'username': username, 'password': password, 'carrier': carrier};

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.post(AuthenticationRemoteService.STANDARD_LOGIN + endpoint, params,{headers: headers}).pipe(
      finalize(() => {
        this.loginLoading = false;
      })
    );
  }

  refresh(refreshToken: string): Observable<any> {
    if (!this.refreshRequest) {
      this.refreshTokenLoading = true;

      this.refreshRequest = this.http.post(AuthenticationRemoteService.URL_AUTH, refreshToken)
        .pipe(
          finalize(() => {
            this.refreshTokenLoading = false;
            this.refreshRequest = undefined;
          })
        ).pipe(
          catchError(error => {
            return throwError(error);
          })
        ).pipe(share());
    }

    return this.refreshRequest;
  }

  loadAccessToken(refreshToken: string): Observable<any> {
    return this.refreshRequest = this.http.post(AuthenticationRemoteService.URL_AUTH, refreshToken);
  }

  loadRefreshToken(uuid: number): Observable<any> {
    return this.http.post(AuthenticationRemoteService.REFRESH_TOKEN, uuid);
  }

  loadUser(endpoint = ""): Observable<any> {
    return this.http.get(AuthenticationRemoteService.MY_USER + endpoint, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  delCurrentCarrier(): void {
    this.http.delete(AuthenticationRemoteService.DEL_CURRENT_CARRIER).subscribe();
  }

  acceptTermsAndConditions(): Observable<any> {
    return this.http.get(AuthenticationRemoteService.ACCEPT_TERMS_AND_CONDITIONS);
  }
}
