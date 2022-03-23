import { TestBed } from '@angular/core/testing';

import { OdysseyServiceLibraryService } from './odyssey-service-library.service';

describe('OdysseyServiceLibraryService', () => {
  let service: OdysseyServiceLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseyServiceLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
