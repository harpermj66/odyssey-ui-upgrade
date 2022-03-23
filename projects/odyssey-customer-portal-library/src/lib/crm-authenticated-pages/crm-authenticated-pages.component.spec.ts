import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmAuthenticatedPagesComponent } from './crm-authenticated-pages.component';

describe('CrmAuthenticatedPagesComponent', () => {
  let component: CrmAuthenticatedPagesComponent;
  let fixture: ComponentFixture<CrmAuthenticatedPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmAuthenticatedPagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmAuthenticatedPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
