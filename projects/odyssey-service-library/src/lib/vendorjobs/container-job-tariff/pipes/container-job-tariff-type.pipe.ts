import { Pipe, PipeTransform } from '@angular/core';
import {RemoveUnderscorePipe} from "../../../pipes/remove-underscore.pipe";
import {TitleCasePipe} from "@angular/common";

/**
 * Converts container job tariff type enums to displayable text.
 */
@Pipe({
  name: 'containerJobTariffType',
  pure: true
})
export class ContainerJobTariffTypePipe implements PipeTransform {
  private static titleCasePipe = new TitleCasePipe();
  private static removeUnderscorePipe = new RemoveUnderscorePipe();

  constructor() {}

  public static format(val?: string | null): string {
    let text = '';
    if(val) {
      if(val === 'PTI') {
        text = val;
      } else {
        text = ContainerJobTariffTypePipe.titleCasePipe.transform(ContainerJobTariffTypePipe.removeUnderscorePipe.transform(val));
      }
    }
    return text;
  }

  transform(val?: string | null): string {
    return ContainerJobTariffTypePipe.format(val);
  }


}
