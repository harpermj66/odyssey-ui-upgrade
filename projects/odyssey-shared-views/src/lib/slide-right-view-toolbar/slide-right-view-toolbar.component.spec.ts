import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideRightViewToolbarComponent } from './slide-right-view-toolbar.component';

describe('SlideRightViewToolbarComponent', () => {
  let component: SlideRightViewToolbarComponent;
  let fixture: ComponentFixture<SlideRightViewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideRightViewToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideRightViewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
