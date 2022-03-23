import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuContainerComponent } from './sidebar-menu-container.component';

describe('SidebarMenuContainerComponent', () => {
  let component: SidebarMenuContainerComponent;
  let fixture: ComponentFixture<SidebarMenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarMenuContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMenuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
