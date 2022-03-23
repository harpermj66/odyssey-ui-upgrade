import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupCreationPageComponent } from './permission-group-creation-page.component';

describe('PermissionGroupCreationPageComponent', () => {
  let component: PermissionGroupCreationPageComponent;
  let fixture: ComponentFixture<PermissionGroupCreationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupCreationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
