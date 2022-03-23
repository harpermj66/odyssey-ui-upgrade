import { TestBed } from '@angular/core/testing';

import { CompanyRemoteService } from './company-remote.service';

describe('CompanyRemoteService', () => {
  let service: CompanyRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
