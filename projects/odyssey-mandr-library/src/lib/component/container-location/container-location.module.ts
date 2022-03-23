import { NgModule } from '@angular/core';
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ContainerLocationLookupComponent} from "./container-location-lookup/container-location-lookup.component";
import {ContainerLocationService} from "../../../../../odyssey-service-library/src/lib/mandr/container-location/service/container-location.service";

@NgModule({
  declarations: [
    ContainerLocationLookupComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule
  ],
  exports: [
    ContainerLocationLookupComponent
  ],
  providers: [
    ContainerLocationService
  ]
})
export class ContainerLocationModule { }
