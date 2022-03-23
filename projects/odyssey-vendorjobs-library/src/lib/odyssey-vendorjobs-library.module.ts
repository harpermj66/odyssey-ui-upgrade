import { NgModule } from '@angular/core';
import {MaterialModule} from "../../../shared/modules/material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {RouterModule} from "@angular/router";
import {MdePopoverModule} from "@material-extended/mde";
import {ContainerCategoryModule} from "./component/container-category/container-category.module";
import {ContainerJobTypeModule} from "./component/container-job-type/container-job-type.module";
import {ContainerJobTariffModule} from "./component/container-job-tariff/container-job-tariff.module";
import {ContainerJobTypeService} from "../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-type.service";
import {ContainerCategoriesService} from "../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-categories.service";
import {ContainerJobTariffService} from "../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-tariff.service";

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    RouterModule,
    MdePopoverModule,
    ContainerCategoryModule,
    ContainerJobTypeModule,
    ContainerJobTariffModule
  ],
  exports: [
  ],
  providers: [
    ContainerJobTypeService,
    ContainerCategoriesService,
    ContainerJobTariffService
  ]
})
export class OdysseyVendorjobsLibraryModule { }
