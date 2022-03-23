import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightInvoiceWrapperComponent } from './freight-invoice-wrapper.component';

describe('FreightInvoiceWrapperComponent', () => {
  let component: FreightInvoiceWrapperComponent;
  let fixture: ComponentFixture<FreightInvoiceWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightInvoiceWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightInvoiceWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
