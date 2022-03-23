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
import {ContainerJobTariffListComponent} from "./container-job-tariff-list/container-job-tariff-list.component";
import {ContainerJobTariffEditComponent} from "./container-job-tariff-edit/container-job-tariff-edit.component";
import {ContainerJobTypeModule} from "../container-job-type/container-job-type.module";
import {ContainerJobTypeService} from "../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-type.service";
import {ContainerCategoryModule} from "../container-category/container-category.module";
import {ContainerJobTariffLumpSumListComponent} from "./container-job-tariff-lump-sum-list/container-job-tariff-lump-sum-list.component";
import {ContainerJobTariffLabourRateListComponent} from "./container-job-tariff-labour-rate-list/container-job-tariff-labour-rate-list.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    ContainerJobTariffListComponent,
    ContainerJobTariffLumpSumListComponent,
    ContainerJobTariffLabourRateListComponent,
    ContainerJobTariffEditComponent
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
    ReactiveFormsModule,
    ContainerJobTypeModule,
    ContainerCategoryModule,
    RouterModule
  ],
  exports: [
    ContainerJobTariffListComponent,
    ContainerJobTariffLumpSumListComponent,
    ContainerJobTariffLabourRateListComponent,
    ContainerJobTariffEditComponent
  ],
  providers: [
    ContainerJobTypeService
  ]
})
export class ContainerJobTariffModule {

}
