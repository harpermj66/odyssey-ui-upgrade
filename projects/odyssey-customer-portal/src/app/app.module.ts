import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FlexLayoutModule} from "@angular/flex-layout";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {
    OdysseyCustomerPortalLibraryModule
} from "../../../odyssey-customer-portal-library/src/lib/odyssey-customer-portal-library.module";
import {AuthenticationService} from "../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {
    StandardRequestInterceptor
} from "../../../odyssey-service-library/src/lib/interceptor/standard-request.interceptor";
import {ThemeService} from "../../../odyssey-service-library/src/lib/theme/theme.service";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {
    OdysseyAdministrationLibraryModule
} from "../../../odyssey-administration-library/src/lib/odyssey-administration-library.module";
import {AuthenticationGuardService} from "../../../odyssey-service-library/src/lib/guard/authentication-guard.service";
import {SubheaderToolbarService} from "../../../odyssey-shared-views/src/lib/subheader-toolbar/subheader-toolbar.service";
import {MaterialModule} from "../../../shared/modules/material-module";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {OdysseyLegacyService} from "../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";
import {CurrentUserService} from "../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {
  SlideOutRightViewSubscriberService
} from "../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";
import { MainMenuComponent } from './main-menu/main-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  OdysseyRouteFinderLibraryModule
} from "../../../odyssey-route-finder-library/src/lib/odyssey-route-finder-library.module";
import {RoleGuardService} from "../../../odyssey-service-library/src/lib/guard/role-guard.service";

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    MainMenuComponent,
    DashboardComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    OdysseyCustomerPortalLibraryModule,
    FormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    OdysseyAdministrationLibraryModule,
    OdysseyRouteFinderLibraryModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [
    AuthenticationService,
    OdysseyLegacyService,
    CurrentUserService,
    SlideOutRightViewSubscriberService,
    { provide: HTTP_INTERCEPTORS,
      useClass: StandardRequestInterceptor,
      multi: true
    },
    AuthenticationGuardService,
    SubheaderToolbarService,
    ThemeService,
    RoleGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
