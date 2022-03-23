import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFavouritesComponent } from './manage-favourites.component';

describe('ManageFavouritesComponent', () => {
  let component: ManageFavouritesComponent;
  let fixture: ComponentFixture<ManageFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFavouritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
