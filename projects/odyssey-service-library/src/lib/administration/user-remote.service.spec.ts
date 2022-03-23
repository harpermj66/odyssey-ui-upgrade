import { TestBed } from '@angular/core/testing';

import { UserRemoteService } from './user-remote.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FindModel} from "../api/find-model";

describe('UserRemoteService', () => {

  let userRemoteService: UserRemoteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserRemoteService
      ]
    });
    userRemoteService = TestBed.inject(UserRemoteService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should allow the retrieval of sorted filtered and paged user lists', () => {
    const findModel = new FindModel( "search", "field1,field2", "sortField desc", 1, 100, "groupField", "field1, field2");
    userRemoteService.findUsers(findModel).subscribe((users) => {
      expect(users).toBeTruthy('Expected some users but got none');
    });

    // @ts-ignore
    const request = httpTestingController.expectOne(req => req.url === 'administration-service/api/user?search=search&fields=field1,field2&sort=sortField desc&page=1&size=100');
    expect(request.request.method).toEqual('GET');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
