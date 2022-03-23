import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineToggleComponent } from './timeline-toggle.component';

describe('ContainerToggleComponent', () => {
  let component: TimelineToggleComponent;
  let fixture: ComponentFixture<TimelineToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
