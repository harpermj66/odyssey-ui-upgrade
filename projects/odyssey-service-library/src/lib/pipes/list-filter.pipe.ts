import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter',
  pure: false
})
export class ListFilterPipe implements PipeTransform {

  constructor() {}

  transform<T>(list: T[], filterFunc: (a: T, index?: number, fullList?: T[]) => boolean): T[] {
    let filtered: T[] = [];
    if(list) {
      filtered = list.filter(filterFunc);
    }
    return filtered;
  }

}
