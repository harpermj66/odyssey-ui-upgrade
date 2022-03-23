import { TestBed } from '@angular/core/testing';

import { OdysseyAdministrationLibraryService } from './odyssey-administration-library.service';

describe('OdysseyAdministrationLibraryService', () => {
  let service: OdysseyAdministrationLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseyAdministrationLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
