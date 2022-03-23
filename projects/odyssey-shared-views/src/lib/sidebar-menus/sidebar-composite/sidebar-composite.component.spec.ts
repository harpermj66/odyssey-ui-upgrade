import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCompositeComponent } from './sidebar-composite.component';

describe('SidebarCompositeComponent', () => {
  let component: SidebarCompositeComponent;
  let fixture: ComponentFixture<SidebarCompositeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarCompositeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCompositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
