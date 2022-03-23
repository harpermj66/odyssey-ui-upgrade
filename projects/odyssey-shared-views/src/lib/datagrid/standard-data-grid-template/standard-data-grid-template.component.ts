import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SelectionModel } from "@angular/cdk/collections";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../../odyssey-service-library/src/lib/authentication/current-user.service";

export class DataGridColumn {
  public static readonly TYPE_STRING = 'String';
  public static readonly TYPE_DATE = 'Date';
  public static readonly TYPE_DOUBLE = 'Double';
  public static readonly TYPE_BOOLEAN = 'Boolean';
  public static readonly TYPE_ENUM = 'Enum';
  public static readonly TYPE_BIG_DECIMAL = 'BigDecimal';
  public static readonly TYPE_LONG = 'Long';
  public static readonly TYPE_FLOAT = 'Float';
  public static readonly TYPE_INT = 'Int';

  constructor(
      public fieldName: string,
      public title: string,
      public align: string,
      public type: string,
      public sortable: boolean = true,
      public collection: boolean = false
  ) {}

}

export class DataGridColumnValue {
  fieldName: string;
  value: any;
}

export class DataGridRow {
  constructor(public guid: string, public key: string, public entityClass: string, public fieldValues?: DataGridColumnValue[]) {}
}

export class ActionMenu {
  children: ActionMenu[] = [];
  constructor(
    public actionId: string,
    public title: string,
    public enabled = true,
    public icon = '',
    public isEnabled?: (row: any, user: CurrentUser | null) => boolean | undefined
  ) {
  }
}

export class ActionMenuEvent {
  /**
   * The menu item that was clicked.
   */
  menu: ActionMenu;

  /**
   * The row object whose menu item was clicked.
   */
  row: any;

  constructor(menu: ActionMenu, row: any) {
    this.menu = menu;
    this.row = row;
  }
}

@Component({
  selector: 'lib-standard-data-grid-template',
  templateUrl: './standard-data-grid-template.component.html',
  styleUrls: ['./standard-data-grid-template.component.scss']
})
export class StandardDataGridTemplateComponent implements OnInit {

  @Output() sortChanged: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() selectionsChanged: EventEmitter<SelectionModel<any>> = new EventEmitter<SelectionModel<any>>();
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() headerActionSelected: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Emits the ID of the menu item that is clicked for a row menu.
   */
  @Output() rowActionSelected: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatSort) sort: MatSort;

  /**
   * Alternative menu event that emits the ActionMenu and the row that was clicked.
   */
  @Output() rowActionAltSelected: EventEmitter<ActionMenuEvent> = new EventEmitter<ActionMenuEvent>();

  @Input() contentHeight = 800;
  @Input() keyField = '';
  @Input() activeSort = '';
  @Input() dataSource = new MatTableDataSource<any>();

  @Input() dataGridColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();
  @Input() multiSelect = true;
  _displayColumns: string[] = [];
  allColumns: string[] = [];
  @Input() headerMenus: ActionMenu[] = [];
  @Input() rowMenus: ActionMenu[] = [];
  _additionalOffset = 0;
  standardOffset = 195;


  selection = new SelectionModel<any>(true, []);
  selectedRow: any;

  constructor(private eleRef: ElementRef,
              public userService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.onResize();
  }


  @Input()
  set additionalOffset(value: number) {
    this._additionalOffset = value;
    this.onResize();
  }

  get additionalOffset(): number {
    return this._additionalOffset;
  }

  @Input()
  set displayColumns(values: string[]) {
    this.allColumns = values;
    const tmpColumns: string[] = [];
    if (values != null && values.length > 0) {
      for (const col of values) {
        if (col !== 'select' && col !== 'buttons') {
          tmpColumns.push(col);
        }
      }
      this._displayColumns = tmpColumns;
    } else {
      this._displayColumns = values;
    }
  }

  get displayColumns(): string[] {
    return this._displayColumns;
  }

  /**
   * Just delegate the sort to parent
   */
  onSortChange(sort: Sort): void  {
    this.sortChanged.emit(sort);
  }

  /**
   * Move the columns and inform the parent
   */
  dropColumn(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.allColumns, event.previousIndex +1, event.currentIndex + 1);
    const cols = this.allColumns.slice(1,this.allColumns.length - 1);
    this.columnOrderingChanged.emit(cols);
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Notify the parent of selection changes
   */
  rowSelectToggle(row: any): void {
    this.selection.toggle(row);
    this.selectionsChanged.emit(this.selection);
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   * Notify the parent of selection changes
   */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.selectionsChanged.emit(this.selection);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  /**
   * Select the current row and notify the parent.
   */
  onSelectRow(row: any): void {
    this.selectedRow = row;
    this.rowSelected.emit(row);
  }

  clearSort(): void {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
    this.sortChanged.emit(this.sort);
  }

  /**
   * Dispatch the selected header menu actionId to the parent
   */
  onHeaderMenuClick(actionId: string): void {
    this.headerActionSelected.emit(actionId);
  }

  /**
   * Dispatch the selected row menu actionId to the parent
   */
  onRowMenuClick(actionId: string): void {
    this.rowActionSelected.emit(actionId);
  }

  /**
   * Dispatch an alternative event that includes the row and the action that was clicked.
   */
  onRowMenuClickAction(menu: ActionMenu, row: any): void {
    this.rowActionAltSelected.emit(new ActionMenuEvent(menu, row));
  }

  getType(column: string): string {
    const ct = this.dataGridColumnMaps.get(column) == null ? 'String' : this.dataGridColumnMaps.get(column);
    if (ct) {
      if (ct.hasOwnProperty('type')) {
        return (ct as DataGridColumn).type;
      } else {
        return 'String';
      }
    } else {
      return 'String';
    }
  }

  getTitle(column: string): string {
    const ct = this.dataGridColumnMaps.get(column) == null ? '' : this.dataGridColumnMaps.get(column);
    if (ct) {
      if (ct.hasOwnProperty('title')) {
        return (ct as DataGridColumn).title;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  isSortable(column: string): boolean {
    const ct = this.dataGridColumnMaps.get(column) == null ? '' : this.dataGridColumnMaps.get(column);
    if (ct) {
      if (ct.hasOwnProperty('sortable')) {
        return (ct as DataGridColumn).sortable;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isCollection(column: string): boolean {
    const ct = this.dataGridColumnMaps.get(column) == null ? '' : this.dataGridColumnMaps.get(column);
    if (ct) {
      if (ct.hasOwnProperty("collection")) {
        return (ct as DataGridColumn).collection;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onResize(): void {
    if (this.eleRef.nativeElement.offsetParent != null && this.eleRef.nativeElement.offsetParent.clientHeight != null) {
      const totalHeight = this.eleRef.nativeElement.offsetParent.clientHeight;
      this.contentHeight = totalHeight - this.standardOffset - this.additionalOffset;
    }
  }
}
