import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {ContainerModule} from "../../../../../odyssey-mandr-library/src/lib/component/container/container.module";
import {ContainerLocationModule} from "../../../../../odyssey-mandr-library/src/lib/component/container-location/container-location.module";
import {CurrencyModule} from "../../../../../odyssey-mandr-library/src/lib/component/currency/currency.module";
import {ContainerJobTypeSelectorComponent} from "./container-job-type-selector/container-job-type-selector.component";
import {ContainerJobTariffListComponent} from "../container-job-tariff/container-job-tariff-list/container-job-tariff-list.component";
import {ContainerJobTariffEditComponent} from "../container-job-tariff/container-job-tariff-edit/container-job-tariff-edit.component";
import {VendorjobsGuardService} from "../../guard/vendorjobs-guard.service";

@NgModule({
  declarations: [
    ContainerJobTypeSelectorComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    ContainerModule,
    ContainerLocationModule,
    CurrencyModule,
    ReactiveFormsModule
  ],
  exports: [
    ContainerJobTypeSelectorComponent
  ],
  providers: [
    ContainerJobTariffListComponent,
    ContainerJobTariffEditComponent,
    VendorjobsGuardService
  ]
})
export class ContainerJobTypeModule {}
