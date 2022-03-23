import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HelpEmbeddedViewComponent} from './help-embedded-view.component';

describe('HelpEmbeddedViewComponent', () => {
  let component: HelpEmbeddedViewComponent;
  let fixture: ComponentFixture<HelpEmbeddedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpEmbeddedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpEmbeddedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
