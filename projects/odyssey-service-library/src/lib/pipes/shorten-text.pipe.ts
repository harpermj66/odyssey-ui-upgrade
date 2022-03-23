import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'shortentext',
  pure: true
})
export class ShortenTextPipe implements PipeTransform {

  transform(value: any, limit: number): any {
    if (value && value.length > limit) {
      return value.substring(0, limit) + ' ...';
    } else {
      return value;
    }

  }
}
