import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateEnquiryComponent } from './rate-enquiry.component';

describe('RateEnquiryComponent', () => {
  let component: RateEnquiryComponent;
  let fixture: ComponentFixture<RateEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
