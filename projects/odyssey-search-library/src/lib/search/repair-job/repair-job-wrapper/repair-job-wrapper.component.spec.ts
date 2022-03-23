import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RepairJobWrapperComponent} from './repair-job-wrapper.component';

describe('RepairJobWrapperComponent', () => {
  let component: RepairJobWrapperComponent;
  let fixture: ComponentFixture<RepairJobWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepairJobWrapperComponent]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairJobWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
