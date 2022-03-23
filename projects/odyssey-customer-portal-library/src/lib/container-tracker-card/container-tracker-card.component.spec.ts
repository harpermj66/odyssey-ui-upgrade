import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTrackerCardComponent } from './container-tracker-card.component';

describe('ContainerTrackerCardComponent', () => {
  let component: ContainerTrackerCardComponent;
  let fixture: ComponentFixture<ContainerTrackerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTrackerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTrackerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
