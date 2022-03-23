import {Component, EventEmitter, OnInit, Output} from '@angular/core';

export class MenuEvent {
  constructor(public legacyView: boolean, public url: string) {}
}

@Component({
  selector: 'lib-legacy-menu',
  templateUrl: './legacy-menu.component.html',
  styleUrls: ['./legacy-menu.component.css']
})
export class LegacyMenuComponent implements OnInit {

  @Output() menuChanged = new EventEmitter<MenuEvent>()

  constructor() { }

  ngOnInit(): void {
  }


}
