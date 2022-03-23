import {Component, Input, OnInit} from '@angular/core';
import {Solution} from "../../../../model/solution";
import {SolutionSummary} from "../../../../model/solution-summary";

@Component({
  selector: 'lib-schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['./schedule-summary.component.scss']
})
export class ScheduleSummaryComponent implements OnInit {

  @Input()
  solution: Solution;

  constructor() { }

  ngOnInit(): void {
    this.setSummary();
  }

  public setSummary() {

  }

  onShowDetail(s:SolutionSummary) {
    s.showDetail = true;
  }

  onHideDetails(s:SolutionSummary) {
    s.showDetail = false;
  }
}
