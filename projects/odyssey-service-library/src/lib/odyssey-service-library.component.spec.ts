import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseyServiceLibraryComponent } from './odyssey-service-library.component';

describe('OdysseyServiceLibraryComponent', () => {
  let component: OdysseyServiceLibraryComponent;
  let fixture: ComponentFixture<OdysseyServiceLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseyServiceLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseyServiceLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
