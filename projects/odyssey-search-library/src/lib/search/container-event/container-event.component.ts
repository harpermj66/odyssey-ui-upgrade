import {Component} from '@angular/core';
import {
    ActionMenu
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
             selector: 'lib-container-event',
             templateUrl: './container-event.component.html',
             styleUrls: ['./container-event.component.css']
           })
export class ContainerEventComponent {

  headerMenus: ActionMenu[] = [
    { actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: '' }
  ];
  rowMenus: ActionMenu[] = [];

}
