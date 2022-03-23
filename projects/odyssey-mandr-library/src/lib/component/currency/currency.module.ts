import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {CurrencyLookupComponent} from "./currency-lookup/currency-lookup.component";
import {CurrencyService} from "../../../../../odyssey-service-library/src/lib/mandr/currency/service/currency.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    CurrencyLookupComponent
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
    OdysseyServiceLibraryModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    CurrencyLookupComponent
  ],
  providers: [
    CurrencyService
  ]
})
export class CurrencyModule{

}
