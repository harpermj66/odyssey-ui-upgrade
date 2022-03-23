import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCountersComponent } from './document-counters.component';

describe('DocumentCountersComponent', () => {
  let component: DocumentCountersComponent;
  let fixture: ComponentFixture<DocumentCountersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCountersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
