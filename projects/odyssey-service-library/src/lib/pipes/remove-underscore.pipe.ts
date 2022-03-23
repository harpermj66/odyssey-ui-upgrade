import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore',
  pure: true
})
export class RemoveUnderscorePipe implements PipeTransform {

  constructor() {}

  transform(val: string): string {
    let converted = '';
    if(val) {
      converted = val.replace(/_/g, ' ');
    }
    return converted;
  }

}
