import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safeResourceUrl'
})
export class SafeResourceUrlPipe implements PipeTransform {

  constructor(private sanitiser: DomSanitizer) {
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.sanitiser.bypassSecurityTrustResourceUrl(value as string);
  }

}
