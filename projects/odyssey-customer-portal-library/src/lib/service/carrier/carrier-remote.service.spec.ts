import { TestBed } from '@angular/core/testing';

import { CarrierRemoteService } from './carrier-remote.service';

describe('CarrierRemoteService', () => {
  let service: CarrierRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrierRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
