import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerEventWrapperComponent} from './container-event-wrapper.component';

describe('ContainerEventWrapperComponent', () => {
  let component: ContainerEventWrapperComponent;
  let fixture: ComponentFixture<ContainerEventWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerEventWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerEventWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
