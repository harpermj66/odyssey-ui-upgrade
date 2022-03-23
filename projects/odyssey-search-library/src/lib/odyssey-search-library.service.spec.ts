import { TestBed } from '@angular/core/testing';

import { OdysseySearchLibraryService } from './odyssey-search-library.service';

describe('OdysseySearchLibraryService', () => {
  let service: OdysseySearchLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseySearchLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
