import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAdministrationComponent } from './workflow-administration.component';

describe('WorkflowAdministrationComponent', () => {
  let component: WorkflowAdministrationComponent;
  let fixture: ComponentFixture<WorkflowAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
