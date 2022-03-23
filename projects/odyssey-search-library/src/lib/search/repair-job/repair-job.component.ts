import {Component} from '@angular/core';
import {
  ActionMenu
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
  selector: 'lib-repair-job',
  templateUrl: './repair-job.component.html',
  styleUrls: ['./repair-job.component.css']
})
export class RepairJobComponent {

  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];
}
