import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteFinderPageComponent } from './route-finder-page.component';

describe('RouteFinderPageComponent', () => {
  let component: RouteFinderPageComponent;
  let fixture: ComponentFixture<RouteFinderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteFinderPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteFinderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
