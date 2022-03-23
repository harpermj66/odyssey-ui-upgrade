import { Component, OnInit } from '@angular/core';
import {RepairJobModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job.model";

@Component({
  selector: 'lib-repair-job-dash',
  templateUrl: './repair-job-dash.component.html',
  styleUrls: ['./repair-job-dash.component.scss']
})
export class RepairJobDashComponent implements OnInit {

  selectedJob: RepairJobModel | null;

  constructor() { }

  ngOnInit(): void {
  }

  jobSelectChange(selected: RepairJobModel[]): void {
    if(selected) {
      this.selectedJob = selected[0];
    } else {
      this.selectedJob = null;
    }
  }
}
