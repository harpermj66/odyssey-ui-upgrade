import { TestBed } from '@angular/core/testing';

import { LanguageRemoteService } from './language-remote.service';

describe('LanguageRemoteService', () => {
  let service: LanguageRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
