import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLiveScheduleComponent } from './view-live-schedule.component';

describe('ViewLiveScheduleComponent', () => {
  let component: ViewLiveScheduleComponent;
  let fixture: ComponentFixture<ViewLiveScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLiveScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLiveScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
