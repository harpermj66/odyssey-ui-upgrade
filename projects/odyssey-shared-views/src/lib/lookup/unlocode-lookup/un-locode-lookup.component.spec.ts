import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnLocodeLookupComponent } from './un-locode-lookup.component';

describe('UnlocodeLookupComponent', () => {
  let component: UnLocodeLookupComponent;
  let fixture: ComponentFixture<UnLocodeLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnLocodeLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnLocodeLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
