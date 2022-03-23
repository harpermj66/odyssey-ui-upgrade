import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingInstructionWrapperComponent } from './shipping-instruction-wrapper.component';

describe('ShippingInstructionWrapperComponent', () => {
  let component: ShippingInstructionWrapperComponent;
  let fixture: ComponentFixture<ShippingInstructionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingInstructionWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingInstructionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
