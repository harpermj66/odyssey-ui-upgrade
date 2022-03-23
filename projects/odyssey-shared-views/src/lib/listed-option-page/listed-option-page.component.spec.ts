import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedOptionPageComponent } from './listed-option-page.component';

describe('ListedOptionPageComponent', () => {
  let component: ListedOptionPageComponent;
  let fixture: ComponentFixture<ListedOptionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedOptionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListedOptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
