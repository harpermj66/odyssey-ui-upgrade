import { TestBed } from '@angular/core/testing';

import { OdysseyCustomerPortalLibraryService } from './odyssey-customer-portal-library.service';

describe('OdysseyCustomerPortalLibraryService', () => {
  let service: OdysseyCustomerPortalLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseyCustomerPortalLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
