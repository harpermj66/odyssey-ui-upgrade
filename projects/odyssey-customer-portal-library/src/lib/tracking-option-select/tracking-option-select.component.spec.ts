import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingOptionSelectComponent } from './tracking-option-select.component';

describe('TrackingOptionSelectComponent', () => {
  let component: TrackingOptionSelectComponent;
  let fixture: ComponentFixture<TrackingOptionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingOptionSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingOptionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
