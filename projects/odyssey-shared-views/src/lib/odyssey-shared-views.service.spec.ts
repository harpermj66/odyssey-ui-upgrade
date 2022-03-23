import { TestBed } from '@angular/core/testing';

import { OdysseySharedViewsService } from './odyssey-shared-views.service';

describe('OdysseySharedViewsService', () => {
  let service: OdysseySharedViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdysseySharedViewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
