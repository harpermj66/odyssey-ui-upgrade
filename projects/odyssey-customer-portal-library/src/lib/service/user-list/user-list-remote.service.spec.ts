import { TestBed } from '@angular/core/testing';

import { UserListRemoteService } from './user-list-remote.service';

describe('UserListRemoteService', () => {
  let service: UserListRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
