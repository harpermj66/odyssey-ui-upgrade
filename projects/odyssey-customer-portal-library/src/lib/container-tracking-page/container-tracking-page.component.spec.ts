import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTrackingPageComponent } from './container-tracking-page.component';

describe('ContainerTrackingPageComponent', () => {
  let component: ContainerTrackingPageComponent;
  let fixture: ComponentFixture<ContainerTrackingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTrackingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTrackingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
