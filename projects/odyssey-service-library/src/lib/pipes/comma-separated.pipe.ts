import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparated',
  pure: true
})
export class CommaSeparatedPipe implements PipeTransform {

  constructor() {}

  transform(val: any[]): string {
    return val.map(it => it.toString()).join(', ');
  }

}
