import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupListPageComponent } from './permission-group-list-page.component';

describe('PermissionGroupListPageComponent', () => {
  let component: PermissionGroupListPageComponent;
  let fixture: ComponentFixture<PermissionGroupListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
