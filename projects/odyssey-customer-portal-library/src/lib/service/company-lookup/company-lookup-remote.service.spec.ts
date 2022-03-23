import { TestBed } from '@angular/core/testing';

import { CompanyLookupRemoteService } from './company-lookup-remote.service';

describe('CompanyLookupRemoteService', () => {
  let service: CompanyLookupRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyLookupRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
