import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerStockWrapperComponent} from './container-stock-wrapper.component';

describe('ContainerStockWrapperComponent', () => {
  let component: ContainerStockWrapperComponent;
  let fixture: ComponentFixture<ContainerStockWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerStockWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerStockWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
