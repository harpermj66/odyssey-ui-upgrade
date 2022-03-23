import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSpecificationComponent } from './container-specification.component';

describe('ContainerSpecificationComponent', () => {
  let component: ContainerSpecificationComponent;
  let fixture: ComponentFixture<ContainerSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerSpecificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
