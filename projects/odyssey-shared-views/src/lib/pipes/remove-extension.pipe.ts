import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'removeExtension',
  pure: true
})
export class RemoveExtensionPipe implements PipeTransform {

  constructor() {}

  transform(val?: string): string {
    return RemoveExtensionPipe.removeExtension(val);
  }

  public static removeExtension(fileName?: string): string {
    let converted = '';
    if(fileName) {
      const extIndex = fileName.lastIndexOf('.');
      if(extIndex >= 0) {
        converted = fileName.substring(0, extIndex);
      } else {
        converted = fileName;
      }
    }
    return converted;
  }

  public static getExtension(fileName?: string): string {
    let extension = '';
    if(fileName) {
      let index = fileName.lastIndexOf('.');
      if(index >= 0) {
        extension = fileName.substring(index, fileName.length);
      } else {
        extension = fileName
      }
    }
    return extension
  }
}
