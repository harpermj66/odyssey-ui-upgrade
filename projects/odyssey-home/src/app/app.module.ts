import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { HomeComponent } from "./home/home.component";
import { RateEnquiryComponent } from "./welcome-page/rate-enquiry/rate-enquiry.component";
import { RouteFinderComponent } from "./route-finder/route-finder.component";
import { ViewLiveScheduleComponent } from "./welcome-page/view-live-schedule/view-live-schedule.component";
import { VgmSubmissionComponent } from "./welcome-page/vgm-submission/vgm-submission.component";
import { ContainerSpecificationComponent } from "./welcome-page/container-specification/container-specification.component";
import { ContainerTrackingComponent } from "./welcome-page/container-tracking/container-tracking.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../../../shared/modules/material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule, Routes } from "@angular/router";
import { OdysseySharedViewsModule } from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import { CommonModule } from "@angular/common";
import { OdysseyServiceLibraryModule } from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import { ModuleNavigatorService } from "../../../odyssey-service-library/src/lib/module-navigation/module-navigator.service";
import { AuthenticationService } from "../../../odyssey-service-library/src/lib/authentication/authentication.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { StandardRequestInterceptor } from "../../../odyssey-service-library/src/lib/interceptor/standard-request.interceptor";
import { OdysseyAdministrationLibraryModule } from "../../../odyssey-administration-library/src/lib/odyssey-administration-library.module";
import { ThemeService } from "../../../odyssey-service-library/src/lib/theme/theme.service";
import { OdysseySearchLibraryModule } from "../../../odyssey-search-library/src/lib/odyssey-search-library.module";
import { MdePopoverModule } from "@material-extended/mde";
import { OdysseyRouteFinderLibraryModule } from "../../../odyssey-route-finder-library/src/lib/odyssey-route-finder-library.module";
import { AuthenticationGuardService } from "../../../odyssey-service-library/src/lib/guard/authentication-guard.service";
import { AuthenticationRemoteService } from "../../../odyssey-service-library/src/lib/authentication/authentication-remote.service";
import { SubheaderToolbarService } from "../../../odyssey-shared-views/src/lib/subheader-toolbar/subheader-toolbar.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OdysseyLegacyPageComponent } from './odyssey-legacy-page/odyssey-legacy-page.component';
import { OdysseyLegacyService } from "./odyssey-legacy-page/odyssey-legacy-service";
import { ActivityService } from "../../../odyssey-service-library/src/lib/session/service/activity.service";
import { SlideOutRightViewComponent } from './home/slide-out-right-view/slide-out-right-view.component';
import { SlideOutRightViewSubscriberService } from "./home/slide-out-right-view/slide-out-right-view-subscriber.service";
import { ApplicationComponentResolverService } from "./home/application-component-resolver.service";
import { PlacedholderDirective } from "./home/PlacedholderDirective";
import { OdysseyMandrLibraryModule } from "../../../odyssey-mandr-library/src/lib/odyssey-mandr-library.module";
import { CurrentUserService } from "../../../odyssey-service-library/src/lib/authentication/current-user.service";
import { ContentWrapperComponent } from "./home/content-wrapper/content-wrapper.component";
import { OdysseyVendorjobsLibraryModule } from "../../../odyssey-vendorjobs-library/src/lib/odyssey-vendorjobs-library.module";
import { SearchMenuComponent } from "./home/menus/search-menu/search-menu.component";
import { RoleGuardService } from "../../../odyssey-service-library/src/lib/guard/role-guard.service";

const routes: Routes = [];

@NgModule({
            declarations: [
              AppComponent,
              WelcomePageComponent,
              HomeComponent,
              RateEnquiryComponent,
              RouteFinderComponent,
    ViewLiveScheduleComponent,
    VgmSubmissionComponent,
    ContainerSpecificationComponent,
    ContainerTrackingComponent,
    OdysseyLegacyPageComponent,
    SlideOutRightViewComponent,
    PlacedholderDirective,
    ContentWrapperComponent,
    SearchMenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    OdysseyAdministrationLibraryModule,
    OdysseyRouteFinderLibraryModule,
    OdysseySearchLibraryModule,
    OdysseyMandrLibraryModule,
    OdysseyVendorjobsLibraryModule,
    MdePopoverModule,
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  providers: [
    ModuleNavigatorService,
    AuthenticationGuardService,
    AuthenticationService,
    AuthenticationRemoteService,
    SubheaderToolbarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StandardRequestInterceptor,
      multi: true
    },
    ThemeService,
    OdysseyLegacyService,
    ActivityService,
    SlideOutRightViewSubscriberService,
    ApplicationComponentResolverService,
    CurrentUserService,
    RoleGuardService
  ],
  exports: [
    ContainerSpecificationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
