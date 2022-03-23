import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFilterItemComponent } from './list-filter-item.component';
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views.module";
import {FilterItem} from "../list-filter.component";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('ListFilterItemComponent', () => {

  let component: ListFilterItemComponent;
  let fixture: ComponentFixture<ListFilterItemComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdysseySharedViewsModule],
      declarations: [ ListFilterItemComponent ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListFilterItemComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it('should create list filter item component ', () => {
    expect(component).toBeTruthy();
  });

  it('should not display item label or value label initially ', () => {
    const nameDiv = el.queryAll(By.css('.nameClass'));
    const valueDiv = el.queryAll(By.css('.valueClass'));
    expect(nameDiv.length === 0).toBeTruthy('Name div exists');
    expect(valueDiv.length === 0).toBeTruthy('Value div exists');
  });

  it('should display item label correctly when passing a FilterItem ', () => {
     component.filterItem = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
     fixture.detectChanges();
     const nameDiv = el.queryAll(By.css('.nameClass'));
     expect(nameDiv.length > 0).toBeTruthy('Name div doesnt exist');
  });

  it('should display item value correctly when passing a FilterItem ', () => {
    component.filterItem = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
    fixture.detectChanges();
    const valueDiv = el.queryAll(By.css('.valueClass'));
    expect(valueDiv.length > 0).toBeTruthy('Value div doesnt exist');
  });

  it('should display correct label and value when passing a FilterItem ', () => {
    component.filterItem = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
    fixture.detectChanges();
    const labelValue = el.queryAll(By.css('#valueLabel'));
    expect(labelValue.length > 0).toBeTruthy('Value div doesnt exist');
  });

  it('should not display input field if not editing ', () => {
    component.filterItem = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
    fixture.detectChanges();
    const inputField = el.queryAll(By.css('#inputField'));
    expect(inputField.length === 0).toBeTruthy('showing input field for editing value when not editing value');
  });

  it('should show input field and not show label value editing ', () => {
    component.filterItem = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
    component.editingFilter = true;
    fixture.detectChanges();
    const labelValue = el.queryAll(By.css('#valueLabel'));
    const inputField = el.queryAll(By.css('#inputField'));
    expect(labelValue.length === 0).toBeTruthy('showing label value field while editing');
    expect(inputField.length > 0).toBeTruthy('not showing input field for editing value when editing value');
  });


});
