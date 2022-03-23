import { TestBed } from '@angular/core/testing';

import { ContainerTrackingRemoteService } from './container-tracking-remote.service';

describe('ContainerTrackingRemoteServiceService', () => {
  let service: ContainerTrackingRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerTrackingRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
