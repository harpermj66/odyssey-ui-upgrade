import {Component} from '@angular/core';
import {
    ActionMenu
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
             selector: 'lib-container-stock',
             templateUrl: './container-stock.component.html',
             styleUrls: ['./container-stock.component.css']
           })
export class ContainerStockComponent {

  headerMenus: ActionMenu[] = [
    { actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: '' }
  ];
  rowMenus: ActionMenu[] = [];

}
