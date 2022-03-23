import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteWrapperComponent } from './credit-note-wrapper.component';

describe('CreditNoteWrapperComponent', () => {
  let component: CreditNoteWrapperComponent;
  let fixture: ComponentFixture<CreditNoteWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
