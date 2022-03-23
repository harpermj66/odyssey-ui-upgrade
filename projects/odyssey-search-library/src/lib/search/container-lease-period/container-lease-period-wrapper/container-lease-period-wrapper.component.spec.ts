import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerLeasePeriodWrapperComponent} from './container-lease-period-wrapper.component';

describe('ContainerLeasePeriodWrapperComponent', () => {
  let component: ContainerLeasePeriodWrapperComponent;
  let fixture: ComponentFixture<ContainerLeasePeriodWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerLeasePeriodWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerLeasePeriodWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
