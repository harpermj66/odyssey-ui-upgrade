import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lib-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss']
})
export class WorkInProgressComponent implements OnInit {

  @Input()
  componentTitle: String = '';

  constructor() { }

  ngOnInit(): void {
  }

}
