import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityWrapperComponent } from './commodity-wrapper.component';

describe('CommodityWrapperComponent', () => {
  let component: CommodityWrapperComponent;
  let fixture: ComponentFixture<CommodityWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommodityWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
