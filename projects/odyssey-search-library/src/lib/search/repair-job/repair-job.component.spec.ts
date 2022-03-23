import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RepairJobComponent} from './repair-job.component';

describe('RepairJobComponent', () => {
  let component: RepairJobComponent;
  let fixture: ComponentFixture<RepairJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepairJobComponent]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
