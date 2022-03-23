import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTrackerComponent } from './container-tracker.component';

describe('ContainerTrackerComponent', () => {
  let component: ContainerTrackerComponent;
  let fixture: ComponentFixture<ContainerTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
