import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VgmSubmissionComponent } from './vgm-submission.component';

describe('VgmSubmissionComponent', () => {
  let component: VgmSubmissionComponent;
  let fixture: ComponentFixture<VgmSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VgmSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VgmSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
