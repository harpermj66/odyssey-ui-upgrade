import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTimelineComponent } from './container-timeline.component';

describe('ContainerTimelineComponent', () => {
  let component: ContainerTimelineComponent;
  let fixture: ComponentFixture<ContainerTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
