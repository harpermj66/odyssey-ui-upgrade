import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTrackerCompactComponent } from './container-tracker-compact.component';

describe('ContainerTrackerCompactComponent', () => {
  let component: ContainerTrackerCompactComponent;
  let fixture: ComponentFixture<ContainerTrackerCompactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTrackerCompactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTrackerCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
