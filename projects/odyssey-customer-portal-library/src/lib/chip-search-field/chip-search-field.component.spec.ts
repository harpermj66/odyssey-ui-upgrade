import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipSearchFieldComponent } from './chip-search-field.component';

describe('NumberSearchFieldComponent', () => {
  let component: ChipSearchFieldComponent;
  let fixture: ComponentFixture<ChipSearchFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipSearchFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
