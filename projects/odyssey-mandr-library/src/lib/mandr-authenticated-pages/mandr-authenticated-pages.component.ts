import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-mandr-authenticated-pages',
  templateUrl: './mandr-authenticated-pages.component.html',
  styleUrls: ['./mandr-authenticated-pages.component.scss']
})
export class MandrAuthenticatedPagesComponent implements OnInit {

  showFiller = false;

  constructor() { }

  ngOnInit(): void {
  }

}
