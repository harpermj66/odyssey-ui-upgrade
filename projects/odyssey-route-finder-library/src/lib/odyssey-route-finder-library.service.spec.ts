import { TestBed } from '@angular/core/testing';

import { OdysseyRouteFinderLibraryService } from './odyssey-route-finder-library.service';

describe('OdysseyRouteFinderLibraryService', () => {
  let service: OdysseyRouteFinderLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseyRouteFinderLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
