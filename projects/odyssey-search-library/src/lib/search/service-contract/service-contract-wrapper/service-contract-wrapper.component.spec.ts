import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceContractWrapperComponent } from './service-contract-wrapper.component';

describe('ServiceContractWrapperComponent', () => {
  let component: ServiceContractWrapperComponent;
  let fixture: ComponentFixture<ServiceContractWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceContractWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceContractWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
