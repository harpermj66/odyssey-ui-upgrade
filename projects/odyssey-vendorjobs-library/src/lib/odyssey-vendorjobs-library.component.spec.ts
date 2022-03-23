import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseyVendorjobsLibraryComponent } from './odyssey-vendorjobs-library.component';

describe('OdysseyVendorjobsLibraryComponent', () => {
  let component: OdysseyVendorjobsLibraryComponent;
  let fixture: ComponentFixture<OdysseyVendorjobsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseyVendorjobsLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseyVendorjobsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
