import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCoverPageComponent } from './crm-cover-page.component';

describe('CrmCoverPageComponent', () => {
  let component: CrmCoverPageComponent;
  let fixture: ComponentFixture<CrmCoverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmCoverPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCoverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
