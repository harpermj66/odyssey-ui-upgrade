import { NgModule } from '@angular/core';
import { OdysseyMandrLibraryComponent } from './odyssey-mandr-library.component';
import { MandrCoverPageComponent } from './mandr-cover-page/mandr-cover-page.component';
import {MaterialModule} from "../../../shared/modules/material-module";
import { MandrAuthenticatedPagesComponent } from './mandr-authenticated-pages/mandr-authenticated-pages.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {RouterModule} from "@angular/router";
import {MdePopoverModule} from "@material-extended/mde";
import {CedexCodeService} from "../../../odyssey-service-library/src/lib/mandr/cedex/service/cedex-code.service";
import {RepairJobModule} from "./component/repair-job/repair-job.module";
import {CedexModule} from "./component/cedex/cedex.module";
import {ApprovalLimitsModule} from "./component/approval-limits/approval-limits.module";
import {MatIconModule} from "@angular/material/icon";
import {MandrGuardService} from "./guard/mandr-guard.service";

@NgModule({
  declarations: [
    OdysseyMandrLibraryComponent,
    MandrCoverPageComponent,
    MandrAuthenticatedPagesComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MatCardModule,
    FlexLayoutModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    RouterModule,
    MdePopoverModule,
    RepairJobModule,
    CedexModule,
    ApprovalLimitsModule,
    MatIconModule
  ],
  exports: [
      OdysseyMandrLibraryComponent,
      RepairJobModule,
      CedexModule,
    ApprovalLimitsModule
  ],
  providers: [
    CedexCodeService,
    MandrGuardService
  ]
})
export class OdysseyMandrLibraryModule { }
