import { TestBed } from '@angular/core/testing';

import { UserUpdateRemoteService } from './user-update-remote.service';

describe('UserUpdateRemoteService', () => {
  let service: UserUpdateRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserUpdateRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
