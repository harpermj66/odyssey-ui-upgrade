import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseyCustomerPortalLibraryComponent } from './odyssey-customer-portal-library.component';

describe('OdysseyCustomerPortalLibraryComponent', () => {
  let component: OdysseyCustomerPortalLibraryComponent;
  let fixture: ComponentFixture<OdysseyCustomerPortalLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseyCustomerPortalLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseyCustomerPortalLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
