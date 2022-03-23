import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModuleNavigatorService} from "../../../../odyssey-service-library/src/lib/module-navigation/module-navigator.service";

@Component({
  selector: 'lib-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

  @Output() moduleSelected = new EventEmitter<string>();
  @Input() module = '';

  constructor(public moduleNavigatorService: ModuleNavigatorService) { }

  ngOnInit(): void {
  }

  onModuleChange(value: string): void {
    if (value == 'Admin') {
      this.moduleNavigatorService.openAdministrationModule()
    }
  }
}
