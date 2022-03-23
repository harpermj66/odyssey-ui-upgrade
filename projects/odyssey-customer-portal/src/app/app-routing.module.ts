import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CrmAuthenticatedPagesComponent} from "../../../odyssey-customer-portal-library/src/lib/crm-authenticated-pages/crm-authenticated-pages.component";
import {SigninComponent} from "../../../odyssey-shared-views/src/lib/signin/signin.component";
import {AuthenticationGuardService} from "../../../odyssey-service-library/src/lib/guard/authentication-guard.service";
import {RouteFinderPageComponent} from "../../../odyssey-customer-portal-library/src/lib/route-finder-page/route-finder-page.component";
import {
  ContainerTrackingPageComponent
} from "../../../odyssey-customer-portal-library/src/lib/container-tracking-page/container-tracking-page.component";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import { UserRegistrationPageComponent } from "../../../odyssey-customer-portal-library/src/lib/user-registration-page/user-registration-page.component";
import {RoleGuardService} from "../../../odyssey-service-library/src/lib/guard/role-guard.service";
import {AdminPageComponent} from "../../../odyssey-customer-portal-library/src/lib/admin-page/admin-page.component";
import {
    UserProfilePageComponent
} from "../../../odyssey-customer-portal-library/src/lib/user-profile-page/user-profile-page.component";

const routes: Routes = [
    {path: '', redirectTo: 'cover-page', pathMatch: 'full'},
    {path: 'cover-page', component: WelcomePageComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'route-finder', component: RouteFinderPageComponent},
      {path: 'container-tracking', component: ContainerTrackingPageComponent},
      {
        path: 'admin',
        component: AdminPageComponent,
        canActivate: [RoleGuardService],
        data: {
            requiredRoles: ['ADMIN']
        },
        children: []
      },
      {path: 'profile', component: UserProfilePageComponent, canActivate: [AuthenticationGuardService], data: { application: "customer-portal" }},
    ]},
    {path: 'signIn', component: SigninComponent},
    {path: 'register', component: UserRegistrationPageComponent},
    {path: 'welcome', canActivate: [AuthenticationGuardService], data: { application: "customer-portal" }, component: WelcomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
