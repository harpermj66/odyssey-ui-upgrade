import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'lib-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
  providers: []
})
export class ContentWrapperComponent implements OnInit {

  constructor(private eleRef: ElementRef) {
  }

  ngOnInit(): void {
  }
}
