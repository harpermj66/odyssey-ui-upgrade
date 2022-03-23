import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdysseySearchLibraryComponent } from './odyssey-search-library.component';

describe('OdysseySearchLibraryComponent', () => {
  let component: OdysseySearchLibraryComponent;
  let fixture: ComponentFixture<OdysseySearchLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdysseySearchLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdysseySearchLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
