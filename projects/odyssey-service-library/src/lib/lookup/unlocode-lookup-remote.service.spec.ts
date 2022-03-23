import { TestBed } from '@angular/core/testing';

import { UnlocodeLookupRemoteService } from './unlocode-lookup-remote.service';

describe('UnlocodeLookupRemoteService', () => {
  let service: UnlocodeLookupRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnlocodeLookupRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
