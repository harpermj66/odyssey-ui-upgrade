import { Component, OnInit } from '@angular/core';
import {ActionMenu} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
  selector: 'lib-freight-invoice',
  templateUrl: './freight-invoice.component.html',
  styleUrls: ['./freight-invoice.component.css']
})
export class FreightInvoiceComponent implements OnInit {

  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
