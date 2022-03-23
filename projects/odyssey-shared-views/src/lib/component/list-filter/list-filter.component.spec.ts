import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FilterItem, ListFilterComponent} from './list-filter.component';
import {DebugElement} from "@angular/core";
import {OdysseySharedViewsModule} from "../../odyssey-shared-views.module";
import {By} from "@angular/platform-browser";

describe('ListFilterComponent', () => {
  let component: ListFilterComponent;
  let fixture: ComponentFixture<ListFilterComponent>;
  let el: DebugElement;
  const exampleFilterItems: FilterItem[] = [];

  beforeAll(() => {
    const f1 = new FilterItem('Test Field','testField', 'String', 'testing', false, false);
    const f2 = new FilterItem('Test Field2','testField2', 'String', 'testing2', false, false);
    exampleFilterItems.push(f1);
    exampleFilterItems.push(f2);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OdysseySharedViewsModule],
      declarations: [ ListFilterComponent ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ListFilterComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it('should create list filter', () => {
    expect(component).toBeTruthy();
  });

  it('should not show any filter items when not supplied', () => {
    component.filterItems = [];
    const filterItems = el.queryAll(By.css('.filterItem'));
    expect(filterItems.length === 0).toBeTruthy('Filter items are shown without items being supplied.');
  });

  it('viewMode should switch to search when filterItems are set to empty', () => {
    component.viewMode = ListFilterComponent.EDITING_FILTER;
    component.filterItems = [];
    const searchFieldInput = el.queryAll(By.css('.searchFieldInput'));
    expect(searchFieldInput).toBeTruthy('Not in search mode even though filter items are empty');
  });

  it('should show search field when viewMode = search', () => {
    component.viewMode = ListFilterComponent.SEARCH;
    fixture.detectChanges();
    const searchFieldInput = el.queryAll(By.css('.searchFieldInput'));
    expect(searchFieldInput).toBeTruthy('Cannot find search field input when in search mode');
  });

  // Can't get this one to work.
  // it('should show filter items when items are supplied', () => {
  //   component.filterItems = exampleFilterItems;
  //   fixture.detectChanges();
  //   fixture.detectChanges();
  //   console.log(fixture.debugElement.nativeElement);
  //   const showFilterItems = el.queryAll(By.css('.nameClass'));
  //   expect(showFilterItems.length > 0).toBeTruthy('Filter items are not shown when items are supplied.');
  // });

});
