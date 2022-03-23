import {NgModule} from '@angular/core';
import {OdysseyServiceLibraryComponent} from './odyssey-service-library.component';
import {SafeUrlPipe} from './pipes/safe-url.pipe';
import {ListFilterPipe} from "./pipes/list-filter.pipe";
import {RemoveUnderscorePipe} from "./pipes/remove-underscore.pipe";
import {DefaultPipe} from "./pipes/default.pipe";
import {ShortenTextPipe} from "./pipes/shorten-text.pipe";
import {CommaSeparatedPipe} from "./pipes/comma-separated.pipe";
import {RepairJobStatusPipe} from "./mandr/repair-job/pipe/repair-job-status.pipe";
import {ContainerJobTariffTypePipe} from "./vendorjobs/container-job-tariff/pipes/container-job-tariff-type.pipe";
import {ObjectSortPipe} from "./pipes/object-sort.pipe";

@NgModule({
  declarations: [
    OdysseyServiceLibraryComponent,
    SafeUrlPipe,
    RemoveUnderscorePipe,
    ListFilterPipe,
    DefaultPipe,
    ShortenTextPipe,
    CommaSeparatedPipe,
    RepairJobStatusPipe,
    ContainerJobTariffTypePipe,
    ObjectSortPipe
  ],
  imports: [
  ],
  exports: [
    OdysseyServiceLibraryComponent,
    SafeUrlPipe,
    RemoveUnderscorePipe,
    ListFilterPipe,
    DefaultPipe,
    ShortenTextPipe,
    CommaSeparatedPipe,
    RepairJobStatusPipe,
    ContainerJobTariffTypePipe,
    ObjectSortPipe
  ]
})
export class OdysseyServiceLibraryModule { }
