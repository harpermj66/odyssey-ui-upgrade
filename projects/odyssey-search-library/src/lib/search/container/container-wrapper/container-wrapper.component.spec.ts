import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerWrapperComponent } from './container-wrapper.component';

describe('ContainerWrapperComponent', () => {
  let component: ContainerWrapperComponent;
  let fixture: ComponentFixture<ContainerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
