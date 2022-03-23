import {HttpParams} from "@angular/common/http";
import {Sort} from "@angular/material/sort";

export class SortModel {
  field: string;
  direction?: 'asc' | 'desc';

  static paramValue(sort: SortModel): string {
    return [sort.field, sort.direction ? sort.direction : 'asc'].join(',');
  }

  static fromSort(sort: Sort, secondaryField?: string, secondaryDirection?: 'asc' | 'desc'): SortModel[] {
    const sorts: SortModel[] = [];
    if(sort && sort.active) {
      sorts.push({
        field: sort.active,
        direction: sort.direction ? sort.direction : undefined
      });
    }

    if(secondaryField && secondaryField.trim().length > 0) {
      sorts.push({
        field: secondaryField,
        direction: secondaryDirection
      });
    }
    return sorts;
  }
}
