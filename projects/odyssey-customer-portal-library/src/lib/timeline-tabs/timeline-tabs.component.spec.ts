import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTabsComponent } from './timeline-tabs.component';

describe('TimelineTabsComponent', () => {
  let component: TimelineTabsComponent;
  let fixture: ComponentFixture<TimelineTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
