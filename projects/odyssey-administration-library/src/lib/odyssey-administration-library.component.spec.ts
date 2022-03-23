import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseyAdministrationLibraryComponent } from './odyssey-administration-library.component';

describe('OdysseyAdministrationLibraryComponent', () => {
  let component: OdysseyAdministrationLibraryComponent;
  let fixture: ComponentFixture<OdysseyAdministrationLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseyAdministrationLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseyAdministrationLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
