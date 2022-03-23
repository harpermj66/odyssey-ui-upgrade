import { Component } from '@angular/core';
import { ActionMenu } from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
             selector: 'lib-commodity',
             templateUrl: './commodity.component.html',
             styleUrls: ['./commodity.component.css']
           })
export class CommodityComponent {

  headerMenus: ActionMenu[] = [
    { actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: '' }
  ];
  rowMenus: ActionMenu[] = [];

}
