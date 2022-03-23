import {Component} from '@angular/core';
import {
    ActionMenu
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
             selector: 'lib-container-lease-period',
             templateUrl: './container-lease-period.component.html',
             styleUrls: ['./container-lease-period.component.css']
           })
export class ContainerLeasePeriodComponent {

  headerMenus: ActionMenu[] = [
    { actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: '' }
  ];
  rowMenus: ActionMenu[] = [];

}
