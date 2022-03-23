import { Pipe, PipeTransform } from '@angular/core';
import {RepairJobStatus} from "../model/repair-job-status";

@Pipe({
  name: 'repairJobStatus',
  pure: true
})
export class RepairJobStatusPipe implements PipeTransform {

  constructor() {}

  transform(val?: string | null): string {
    return RepairJobStatus.getDisplayName(val);
  }

}
