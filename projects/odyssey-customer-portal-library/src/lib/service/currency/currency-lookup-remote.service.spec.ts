import { TestBed } from '@angular/core/testing';

import { CurrencyLookupRemoteService } from './currency-lookup-remote.service';

describe('CurrencyLookupRemoteService', () => {
  let service: CurrencyLookupRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyLookupRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
