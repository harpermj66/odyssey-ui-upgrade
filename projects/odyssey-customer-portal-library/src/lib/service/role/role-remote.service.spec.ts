import { TestBed } from '@angular/core/testing';

import { RoleRemoteService } from './role-remote.service';

describe('RoleRemoteService', () => {
  let service: RoleRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
