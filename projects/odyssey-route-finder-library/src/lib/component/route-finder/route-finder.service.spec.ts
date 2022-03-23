import { TestBed } from '@angular/core/testing';

import { RouteFinderService } from './route-finder.service';

describe('RouteFinderService', () => {
  let service: RouteFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
