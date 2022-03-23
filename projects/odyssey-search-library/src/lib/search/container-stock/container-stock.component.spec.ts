import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerStockComponent} from './container-stock.component';

describe('ContainerStockComponent', () => {
  let component: ContainerStockComponent;
  let fixture: ComponentFixture<ContainerStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
