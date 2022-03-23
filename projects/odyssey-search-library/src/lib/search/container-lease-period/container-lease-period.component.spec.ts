import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContainerLeasePeriodComponent} from './container-lease-period.component';

describe('ContainerLeasePeriodComponent', () => {
  let component: ContainerLeasePeriodComponent;
  let fixture: ComponentFixture<ContainerLeasePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerLeasePeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerLeasePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
