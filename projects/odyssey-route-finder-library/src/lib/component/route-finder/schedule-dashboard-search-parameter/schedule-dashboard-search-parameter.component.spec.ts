import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDashboardSearchParameterComponent } from './schedule-dashboard-search-parameter.component';

describe('ScheduleDashboardSearchParameterComponent', () => {
  let component: ScheduleDashboardSearchParameterComponent;
  let fixture: ComponentFixture<ScheduleDashboardSearchParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDashboardSearchParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDashboardSearchParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
