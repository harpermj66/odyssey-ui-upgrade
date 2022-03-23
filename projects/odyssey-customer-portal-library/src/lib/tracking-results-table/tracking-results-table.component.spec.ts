import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingResultsTableComponent } from './tracking-results-table.component';

describe('TrackingResultsTableComponent', () => {
  let component: TrackingResultsTableComponent;
  let fixture: ComponentFixture<TrackingResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingResultsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
