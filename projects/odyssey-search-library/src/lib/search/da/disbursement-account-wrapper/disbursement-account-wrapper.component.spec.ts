import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementAccountWrapperComponent } from './disbursement-account-wrapper.component';

describe('DisbursementAccountWrapperComponent', () => {
  let component: DisbursementAccountWrapperComponent;
  let fixture: ComponentFixture<DisbursementAccountWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementAccountWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementAccountWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
