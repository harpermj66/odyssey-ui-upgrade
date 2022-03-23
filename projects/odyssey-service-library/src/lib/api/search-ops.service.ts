import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchOpsService {

  constructor() { }

  constructOrFilter(filter: string, fields: string[]): string {
    let rsql = '(';
    fields.forEach( field => {
      rsql = rsql + field + '==' + '*' + filter + '*,';
    });
    return rsql.substring(0, rsql.length - 1) + ')';
  }

}
