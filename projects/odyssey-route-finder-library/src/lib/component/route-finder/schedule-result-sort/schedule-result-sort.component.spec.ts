import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleResultSortComponent } from './schedule-result-sort.component';

describe('ScheduleResultSortComponent', () => {
  let component: ScheduleResultSortComponent;
  let fixture: ComponentFixture<ScheduleResultSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleResultSortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleResultSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
