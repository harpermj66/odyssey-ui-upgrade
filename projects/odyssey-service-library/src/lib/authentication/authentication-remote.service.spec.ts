import { TestBed } from '@angular/core/testing';

import { AuthenticationRemoteService } from './authentication-remote.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AUTH_TOKENS} from "../../../../test-data/odyssey-service-library/auth-test-data";

describe('AuthenticationRemoteService', () => {

  let authenticationRemoteService: AuthenticationRemoteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationRemoteService
      ]
    });

    authenticationRemoteService = TestBed.inject(AuthenticationRemoteService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should allow authentication of a user by supplying username and password and return the required tokens', () => {

    authenticationRemoteService.authenticate('user', 'password')
      .subscribe(result => {
        expect(result).toBeTruthy('No results returned');
        expect(result.hasOwnProperty('access_token')).toBeTruthy('Failed to find access_token in result');
        expect(result.hasOwnProperty('refresh_token')).toBeTruthy('Failed to find refresh_token in result');
    });

    const req = httpTestingController.expectOne('odyssey-keycloak-service/auth/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.username).toEqual('user');
    expect(req.request.body.password).toEqual('password');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');

    req.flush(AUTH_TOKENS);

  });

  it('should allow authentication of a user by supplying username and password and carrier, return the required tokens', () => {

    authenticationRemoteService.authenticate('user', 'password', 'carrier')
      .subscribe(result => {
        expect(result).toBeTruthy('No results returned');
        expect(result.hasOwnProperty('access_token')).toBeTruthy('Failed to find access_token in result');
        expect(result.hasOwnProperty('refresh_token')).toBeTruthy('Failed to find refresh_token in result');
      });

    const req = httpTestingController.expectOne('odyssey-keycloak-service/auth/login');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.username).toEqual('user');
    expect(req.request.body.password).toEqual('password');
    expect(req.request.body.carrier).toEqual('carrier');
    expect(req.request.headers.get('Content-Type')).toEqual('application/json');

    req.flush(AUTH_TOKENS);

  });

  it('should allow the main application interceptor to get an access token by using a valid refresh token', () => {
    authenticationRemoteService.refresh('refresh_token')
      .subscribe(result => {
        expect(result).toBeTruthy('No results returned');
        expect(result.hasOwnProperty('access_token')).toBeTruthy('Failed to find access_token in result');
        expect(result.hasOwnProperty('refresh_token')).toBeTruthy('Failed to find refresh_token in result');
      });

    const req = httpTestingController.expectOne('odyssey-keycloak-service/auth/refresh');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual('refresh_token');

    req.flush(AUTH_TOKENS);
  });

  it('should allow manual retrieval of access token by using a valid refresh token', () => {
    authenticationRemoteService.loadAccessToken('refresh_token')
      .subscribe(result => {
        expect(result).toBeTruthy('No results returned');
        expect(result.hasOwnProperty('access_token')).toBeTruthy('Failed to find access_token in result');
        expect(result.hasOwnProperty('refresh_token')).toBeTruthy('Failed to find refresh_token in result');
      });

    const req = httpTestingController.expectOne('odyssey-keycloak-service/auth/refresh');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual('refresh_token');

    req.flush(AUTH_TOKENS);
  });

  it('should allow manual retrieval of a refresh_token token by using a unique guid - relies on refresh token store mapped to guid and stored elsewhere', () => {
    authenticationRemoteService.loadRefreshToken(1234)
      .subscribe(result => {
        expect(result).toBeTruthy('No results returned');
        expect(result.hasOwnProperty('refresh_token')).toBeTruthy('Failed to find refresh_token in result');
      });

    const req = httpTestingController.expectOne('odyssey-keycloak-service/auth/route');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(1234);

    req.flush(AUTH_TOKENS);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
