import { NgModule } from '@angular/core';
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CedexCodeService} from "../../../../../odyssey-service-library/src/lib/mandr/cedex/service/cedex-code.service";
import {CedexSelectFieldComponent} from "./cedex-select-field/cedex-select-field.component";
import {CedexComponentSelectComponent} from "./cedex-component-select/cedex-component-select.component";
import {CedexDamageSelectComponent} from "./cedex-damage-select/cedex-damage-select.component";
import {CedexRepairSelectComponent} from "./cedex-repair-select/cedex-repair-select.component";
import {CedexLocationSelectComponent} from "./cedex-location-select/cedex-location-select.component";

@NgModule({
  declarations: [
    CedexSelectFieldComponent,
    CedexComponentSelectComponent,
    CedexDamageSelectComponent,
    CedexRepairSelectComponent,
    CedexLocationSelectComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule
  ],
  exports: [
    CedexComponentSelectComponent,
    CedexDamageSelectComponent,
    CedexRepairSelectComponent,
    CedexLocationSelectComponent
  ],
  providers: [
    CedexCodeService
  ]
})
export class CedexModule { }
