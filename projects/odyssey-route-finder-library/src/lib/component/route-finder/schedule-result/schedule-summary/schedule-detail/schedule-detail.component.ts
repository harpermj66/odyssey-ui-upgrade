import {Component, Input, OnInit} from '@angular/core';
import {SolutionDetail} from "../../../../../model/solution-detail";
import {SolutionSummary} from "../../../../../model/solution-summary";

export class DetailRenderHelper {
  public isLayover = false;
  public details: SolutionDetail[] = []
  public detail: SolutionDetail;
  public duration: string;
  public etd: Date;
  public eta: Date;
}

@Component({
  selector: 'lib-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})
export class ScheduleDetailComponent implements OnInit {

  _summary: SolutionSummary;
  detailRenderers: DetailRenderHelper[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set summary(value: SolutionSummary) {
    this._summary = value;
    if (value != null && value.details != null) {
      this.constructDetails(value);
    }
  }

  get summary(): SolutionSummary {
    return this._summary;
  }

  constructDetails(value: SolutionSummary) {
    this.detailRenderers = [];
    for (let i = 0; i < value.details.length; i++) {
      if (i === 0 || i === 3 || i === 6 || i === 9 || i === 12 || i === 15) {
        value.details[i].displayDate = value.etd;
        const dr = new DetailRenderHelper();
        dr.isLayover = false;
        dr.details.push(value.details[i]);
        dr.duration = value.details[i].duration;
        // dr.eta = value.details[i].
        this.detailRenderers.push(dr);
      }

      if (i === 1 || i === 4 || i === 7 || i === 10 || i === 13 || i === 16) {
        value.details[i].displayDate = value.eta;
        this.detailRenderers[this.detailRenderers.length -1].details.push(value.details[i]);
      }

      if (i === 2 || i === 5 || i === 8 || i === 11 || i === 14 || i === 17) {
        const dr = new DetailRenderHelper();
        dr.isLayover = true;
        dr.detail = value.details[i]
        this.detailRenderers.push(dr);
      }
    }
  }

}
