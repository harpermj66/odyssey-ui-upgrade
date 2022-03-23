import { NgModule } from '@angular/core';
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ContainerLookupComponent} from "./container-lookup/container-lookup.component";
import {ContainerService} from "../../../../../odyssey-service-library/src/lib/mandr/container/service/container.service";

@NgModule({
  declarations: [
    ContainerLookupComponent
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
    ContainerLookupComponent
  ],
  providers: [
    ContainerService
  ]
})
export class ContainerModule { }
