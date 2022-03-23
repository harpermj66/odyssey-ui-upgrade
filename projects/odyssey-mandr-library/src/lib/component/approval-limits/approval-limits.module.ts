import {NgModule} from "@angular/core";
import {ApprovalLimitsListComponent} from "./approval-limits-list/approval-limits-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {ApprovalLimitsService} from "../../../../../odyssey-service-library/src/lib/mandr/approval-limits/service/approval-limits.service";
import {ContainerApprovalLimitsService} from "../../../../../odyssey-service-library/src/lib/mandr/approval-limits/service/container-approval-limits.service";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {CdkTableModule} from "@angular/cdk/table";
import {ApprovalLimitsEditComponent} from "./approval-limits-edit/approval-limits-edit.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {CurrencyModule} from "../currency/currency.module";
import {ContainerLocationModule} from "../container-location/container-location.module";
import {ContTypeGroupService} from "../../../../../odyssey-service-library/src/lib/mandr/cont-type-group/service/cont-type-group.service";


@NgModule({
  declarations: [
    ApprovalLimitsListComponent,
    ApprovalLimitsEditComponent
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
        CurrencyModule,
        ContainerLocationModule,
        ReactiveFormsModule
    ],
  exports:[
    ApprovalLimitsListComponent,
    ApprovalLimitsEditComponent
  ],
  providers: [
    ApprovalLimitsService,
    ContainerApprovalLimitsService,
    ContTypeGroupService
  ]
})
export class ApprovalLimitsModule{

}
