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
import {ContainerCategoriesService} from "../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-categories.service";
import {ContainerCategoryMultiSelectorComponent} from "./container-category-multi-selector/container-category-multi-selector.component";

@NgModule({
  declarations: [
    ContainerCategoryMultiSelectorComponent
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
    ContainerCategoryMultiSelectorComponent
  ],
  providers: [
    ContainerCategoriesService
  ]
})
export class ContainerCategoryModule {}
