import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lib-slide-right-view-toolbar',
  templateUrl: './slide-right-view-toolbar.component.html',
  styleUrls: ['./slide-right-view-toolbar.component.scss']
})
export class SlideRightViewToolbarComponent implements OnInit {

  _title: string;

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set title(value: string) {
    this._title = value;
  }

  get title(): string {
    return this._title;
  }
}
