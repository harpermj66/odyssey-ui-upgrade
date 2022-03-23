import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseyRouteFinderLibraryComponent } from './odyssey-route-finder-library.component';

describe('OdysseyRouteFinderLibraryComponent', () => {
  let component: OdysseyRouteFinderLibraryComponent;
  let fixture: ComponentFixture<OdysseyRouteFinderLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseyRouteFinderLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseyRouteFinderLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
