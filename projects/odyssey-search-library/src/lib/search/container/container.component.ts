import { Component } from '@angular/core';
import { ActionMenu } from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
             selector: 'lib-container',
             templateUrl: './container.component.html',
             styleUrls: ['./container.component.css']
           })
export class ContainerComponent {

  headerMenus: ActionMenu[] = [
    { actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: '' }
  ];
  rowMenus: ActionMenu[] = [];

}
