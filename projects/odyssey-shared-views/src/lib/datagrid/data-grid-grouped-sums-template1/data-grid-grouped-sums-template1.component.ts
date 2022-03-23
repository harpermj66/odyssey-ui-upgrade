import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ActionMenu, DataGridColumn} from "../standard-data-grid-template/standard-data-grid-template.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'lib-data-grid-grouped-sums-template1',
  templateUrl: './data-grid-grouped-sums-template1.component.html',
  styleUrls: ['./data-grid-grouped-sums-template1.component.scss']
})
export class DataGridGroupedSumsTemplate1Component implements OnInit {

  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() selectionsChanged: EventEmitter<SelectionModel<any>> = new EventEmitter<SelectionModel<any>>();
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() headerActionSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() rowActionSelected: EventEmitter<string> = new EventEmitter<string>();

  _dataSource = new MatTableDataSource<any>();
  @Input() dataGridColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();
  @Input() headerMenus: ActionMenu[] = [];
  @Input() rowMenus: ActionMenu[] = [];
  @Input() keyField = '';
  @Input() multiSelect = true;

  selection = new SelectionModel<any>(true, []);
  _displayColumns: string[] = [];
  allColumns: string[] = [];

  selectedRow: any;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set dataSource(value: MatTableDataSource<any>) {
    this._dataSource = value;
  }

  get dataSource(): MatTableDataSource<any> {
    return this._dataSource;
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
   * Move the columns and inform the parent
   */
  dropColumn(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.allColumns, event.previousIndex +1, event.currentIndex + 1);
    const cols = this.allColumns.slice(1,this.allColumns.length - 1);
    this.columnOrderingChanged.emit(cols);
  }

  /**
   * Dispatch the selected header menu actionId to the parent
   */
  onHeaderMenuClick(actionId: string): void {
    this.headerActionSelected.emit(actionId);
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
   * Dispatch the selected row menu actionId to the parent
   */
  onRowMenuClick(actionId: string): void {
    this.rowActionSelected.emit(actionId);
  }

  /**
   * Select the current row and notify the parent.
   */
  onSelectRow(row: any): void {
    this.selectedRow = row;
    this.rowSelected.emit(row);
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
}
