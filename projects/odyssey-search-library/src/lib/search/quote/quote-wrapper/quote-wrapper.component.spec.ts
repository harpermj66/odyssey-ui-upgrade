import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteWrapperComponent } from './quote-wrapper.component';

describe('QuoteWrapperComponent', () => {
  let component: QuoteWrapperComponent;
  let fixture: ComponentFixture<QuoteWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuoteWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
