import { TestBed } from '@angular/core/testing';

import { OdysseyVendorjobsLibraryService } from './odyssey-vendorjobs-library.service';

describe('OdysseyVendorjobsLibraryService', () => {
  let service: OdysseyVendorjobsLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseyVendorjobsLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
