import { TestBed } from '@angular/core/testing';

import { TimeZoneRemoteService } from './time-zone-remote.service';

describe('TimeZoneRemoteService', () => {
  let service: TimeZoneRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeZoneRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
