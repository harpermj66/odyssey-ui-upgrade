import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOutRightViewComponent } from './slide-out-right-view.component';

describe('SlideOutRightViewComponent', () => {
  let component: SlideOutRightViewComponent;
  let fixture: ComponentFixture<SlideOutRightViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideOutRightViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideOutRightViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
