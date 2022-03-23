import { NgModule } from '@angular/core';
import { OdysseyCustomerPortalLibraryComponent } from './odyssey-customer-portal-library.component';
import { CrmCoverPageComponent } from './crm-cover-page/crm-cover-page.component';
import {MaterialModule} from "../../../shared/modules/material-module";
import { CrmAuthenticatedPagesComponent } from './crm-authenticated-pages/crm-authenticated-pages.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {RouterModule} from "@angular/router";
import {RouteFinderPageComponent } from './route-finder-page/route-finder-page.component';
import {OdysseyRouteFinderLibraryModule} from "../../../odyssey-route-finder-library/src/lib/odyssey-route-finder-library.module";
import {CommonModule} from "@angular/common";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import { ContainerTrackingPageComponent } from './container-tracking-page/container-tracking-page.component';
import { ContainerTimelineComponent } from './container-timeline/container-timeline.component';
import {MglTimelineModule} from "angular-mgl-timeline";
import { ContainerTrackerComponent } from './container-tracker/container-tracker.component';
import { TrackingResultsTableComponent } from './tracking-results-table/tracking-results-table.component';
import { ChipSearchFieldComponent } from './chip-search-field/chip-search-field.component';
import { TrackingOptionSelectComponent } from './tracking-option-select/tracking-option-select.component';
import { TimelineToggleComponent } from './timeline-toggle/timeline-toggle.component';
import { ContainerTrackerCompactComponent } from './container-tracker-compact/container-tracker-compact.component';
import { ContainerTrackerCardComponent } from './container-tracker-card/container-tracker-card.component';
import { TimelineTabsComponent } from './timeline-tabs/timeline-tabs.component';
import { UserRegistrationPageComponent } from './user-registration-page/user-registration-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import {CdkStepperModule} from "@angular/cdk/stepper";
import { CurrencyLookupComponent } from './currency-lookup/currency-lookup.component';
import { SidebarContainerComponent } from './navigation/sidebar/sidebar-container/sidebar-container.component';
import { SidebarMenuItemComponent } from './navigation/sidebar/sidebar-menu-item/sidebar-menu-item.component';
import { SidebarMenuContainerComponent } from './navigation/sidebar/sidebar-menu-container/sidebar-menu-container.component';
import { UserCreationPageComponent } from './user-creation-page/user-creation-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserListPageComponent } from './user-list-page/user-list-page.component';
import { ActionToolbarComponent } from './action-toolbar/action-toolbar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PermissionGroupCreationPageComponent } from './permission-group-creation-page/permission-group-creation-page.component';
import { PermissionGroupListPageComponent } from './permission-group-list-page/permission-group-list-page.component';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';

@NgModule({
  declarations: [
    OdysseyCustomerPortalLibraryComponent,
    CrmCoverPageComponent,
    CrmAuthenticatedPagesComponent,
    RouteFinderPageComponent,
    ContainerTrackingPageComponent,
    ContainerTimelineComponent,
    ContainerTrackerComponent,
    TrackingResultsTableComponent,
    ChipSearchFieldComponent,
    TrackingOptionSelectComponent,
    TimelineToggleComponent,
    ContainerTrackerCompactComponent,
    ContainerTrackerCardComponent,
    TimelineTabsComponent,
    UserRegistrationPageComponent,
    CurrencyLookupComponent,
    SidebarContainerComponent,
    SidebarMenuItemComponent,
    SidebarMenuContainerComponent,
    UserCreationPageComponent,
    AdminPageComponent,
    UserListPageComponent,
    ActionToolbarComponent,
    ConfirmationDialogComponent,
    PermissionGroupCreationPageComponent,
    PermissionGroupListPageComponent,
    UserProfilePageComponent,
  ],
    imports: [
        MaterialModule,
        FlexLayoutModule,
        OdysseyRouteFinderLibraryModule,
        OdysseySharedViewsModule,
        CommonModule,
        RouterModule,
        MglTimelineModule,
        ReactiveFormsModule,
        MatStepperModule,
        CdkStepperModule,
        FormsModule,
    ],
  exports: [
      OdysseyCustomerPortalLibraryComponent,
      ContainerTrackerCompactComponent,
      ChipSearchFieldComponent,
      TrackingOptionSelectComponent,
      ContainerTrackerCardComponent,
      SidebarContainerComponent
  ]
})
export class OdysseyCustomerPortalLibraryModule { }
