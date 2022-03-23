import { NgModule } from '@angular/core';
import {RepairJobListComponent} from "./repair-job-list/repair-job-list.component";
import {RepairJobService} from "../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job.service";
import {MaterialModule} from "../../../../../shared/modules/material-module";
import {OdysseySharedViewsModule} from "../../../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {RepairItemListComponent} from "./repair-item-list/repair-item-list.component";
import {RepairItemService} from "../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-item.service";
import {RepairJobDashComponent} from "./repair-job-dash/repair-job-dash.component";
import {CedexModule} from "../cedex/cedex.module";
import {RepairJobEditComponent} from "./repair-job-edit/repair-job-edit.component";
import {ContainerModule} from "../container/container.module";
import {ContainerLocationModule} from "../container-location/container-location.module";
import {ContainerEventService} from "../../../../../odyssey-service-library/src/lib/mandr/container-event/service/container-event.service";
import {RepairCommentListComponent} from "./repair-comment-list/repair-comment-list.component";
import {RepairItemCommentService} from "../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-item-comment.service";
import {ConfirmIgnoreValidationDialogComponent} from "./confirm-ignore-validation-dialog/confirm-ignore-validation-dialog.component";
import {RepairItemEditComponent} from "./repair-item-edit/repair-item-edit.component";
import {RepairJobCommentService} from "../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job-comment.service";
import {RepairJobAttachmentsListComponent} from "./repair-job-attachments-list/repair-job-attachments-list.component";
import {RepairJobAttachmentService} from "../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job-attachment.service";
import {RepairJobAttachmentsViewComponent} from "./repair-job-attachment-view/repair-job-attachments-view.component";
import {CurrencyModule} from "../currency/currency.module";

@NgModule({
  declarations: [
    RepairJobListComponent,
    RepairItemListComponent,
    RepairJobDashComponent,
    RepairJobEditComponent,
    RepairCommentListComponent,
    ConfirmIgnoreValidationDialogComponent,
    RepairItemEditComponent,
    RepairJobAttachmentsListComponent,
    RepairJobAttachmentsViewComponent
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
        CedexModule,
        ContainerModule,
        ContainerLocationModule,
        CurrencyModule,
        ReactiveFormsModule
    ],
  exports: [
    RepairJobListComponent,
    RepairItemListComponent,
    RepairJobDashComponent,
    RepairJobEditComponent,
    RepairCommentListComponent,
    RepairItemEditComponent,
    RepairJobAttachmentsListComponent,
    RepairJobAttachmentsViewComponent
  ],
  providers: [
    RepairJobService,
    RepairItemService,
    RepairItemCommentService,
    RepairJobCommentService,
    RepairJobAttachmentService,
    ContainerEventService
  ]
})
export class RepairJobModule { }
