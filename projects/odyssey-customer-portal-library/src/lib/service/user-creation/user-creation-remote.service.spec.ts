import { TestBed } from '@angular/core/testing';

import { UserCreationRemoteService } from './user-creation-remote.service';

describe('UserCreationRemoteService', () => {
  let service: UserCreationRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCreationRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
