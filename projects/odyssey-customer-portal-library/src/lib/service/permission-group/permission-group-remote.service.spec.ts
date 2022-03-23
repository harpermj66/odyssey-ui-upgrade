import { TestBed } from '@angular/core/testing';

import { PermissionGroupRemoteService } from './permission-group-remote.service';

describe('PermissionGroupRemoteService', () => {
  let service: PermissionGroupRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionGroupRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
