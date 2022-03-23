import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {HomeComponent} from "./home/home.component";
import {SigninComponent} from "../../../odyssey-shared-views/src/lib/signin/signin.component";
import {UserListComponent} from "../../../odyssey-administration-library/src/lib/users/user-list/user-list.component";
import {UserEditComponent} from "../../../odyssey-administration-library/src/lib/users/user-edit/user-edit.component";
import {RouteFinderComponent} from "./route-finder/route-finder.component";
import {AuthenticationGuardService} from "../../../odyssey-service-library/src/lib/guard/authentication-guard.service";
import {
  RepairJobDashComponent
} from "../../../odyssey-mandr-library/src/lib/component/repair-job/repair-job-dash/repair-job-dash.component";
import {
  RepairJobListComponent
} from "../../../odyssey-mandr-library/src/lib/component/repair-job/repair-job-list/repair-job-list.component";
import {
  ApprovalLimitsListComponent
} from "../../../odyssey-mandr-library/src/lib/component/approval-limits/approval-limits-list/approval-limits-list.component";
import {
  RepairItemListComponent
} from "../../../odyssey-mandr-library/src/lib/component/repair-job/repair-item-list/repair-item-list.component";
import {
  QuoteWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/quote/quote-wrapper/quote-wrapper.component";
import {
  ServiceContractWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/service-contract/service-contract-wrapper/service-contract-wrapper.component";
import {
  BookingWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/booking/booking-wrapper/booking-wrapper.component";
import {
  ShippingInstructionWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/si/shipping-instruction-wrapper/shipping-instruction-wrapper.component";
import {
  FreightInvoiceWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/freight-invoice/freight-invoice-wrapper/freight-invoice-wrapper.component";
import {
  CreditNoteWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/c-note/credit-note-wrapper/credit-note-wrapper.component";
import {
  DisbursementAccountWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/da/disbursement-account-wrapper/disbursement-account-wrapper.component";
import {VendorjobsGuardService} from "../../../odyssey-vendorjobs-library/src/lib/guard/vendorjobs-guard.service";
import {
  ContainerJobTariffListComponent
} from "../../../odyssey-vendorjobs-library/src/lib/component/container-job-tariff/container-job-tariff-list/container-job-tariff-list.component";
import {
  ContainerJobTariffEditComponent
} from "../../../odyssey-vendorjobs-library/src/lib/component/container-job-tariff/container-job-tariff-edit/container-job-tariff-edit.component";
import {
  RepairJobEditComponent
} from "../../../odyssey-mandr-library/src/lib/component/repair-job/repair-job-edit/repair-job-edit.component";
import {
  RepairItemEditComponent
} from "../../../odyssey-mandr-library/src/lib/component/repair-job/repair-item-edit/repair-item-edit.component";
import {
  ApprovalLimitsEditComponent
} from "../../../odyssey-mandr-library/src/lib/component/approval-limits/approval-limits-edit/approval-limits-edit.component";
import {
  ContainerJobTariffLumpSumListComponent
} from "../../../odyssey-vendorjobs-library/src/lib/component/container-job-tariff/container-job-tariff-lump-sum-list/container-job-tariff-lump-sum-list.component";
import {
  ContainerJobTariffLabourRateListComponent
} from "../../../odyssey-vendorjobs-library/src/lib/component/container-job-tariff/container-job-tariff-labour-rate-list/container-job-tariff-labour-rate-list.component";
import {
  RepairJobWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/repair-job/repair-job-wrapper/repair-job-wrapper.component";
import {RoleGuardService} from "../../../odyssey-service-library/src/lib/guard/role-guard.service";
import {
  ContainerEventWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/container-event/container-event-wrapper/container-event-wrapper.component";
import {
  ContainerWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/container/container-wrapper/container-wrapper.component";
import {
  CommodityWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/commodity/commodity-wrapper/commodity-wrapper.component";
import {
  ContainerStockWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/container-stock/container-stock-wrapper/container-stock-wrapper.component";
import {
  ContainerLeasePeriodWrapperComponent
} from "../../../odyssey-search-library/src/lib/search/container-lease-period/container-lease-period-wrapper/container-lease-period-wrapper.component";
import {MandrGuardService} from "../../../odyssey-mandr-library/src/lib/guard/mandr-guard.service";

const routes: Routes = [
  { path: '', redirectTo: 'cover-page', pathMatch: 'full' },
  { path: 'cover-page', component: WelcomePageComponent },
  { path: 'signIn', component: SigninComponent },
  {
    path: 'welcome', canActivate: [AuthenticationGuardService], component: HomeComponent, children: [
      { path: 'user-admin', component: UserListComponent },
      { path: 'user-edit', component: UserEditComponent },
      {
        path: 'search-quotes', component: QuoteWrapperComponent, canActivate: [RoleGuardService],
        data: { requiredRoles: ['QUOTE_VIEWER', 'QUOTE_EDITOR', 'QUOTE_APPROVER'] }
      },
      {
        path: 'search-service-contracts', component: ServiceContractWrapperComponent, canActivate: [RoleGuardService],
        data: { requiredRoles: ['SERVICE_CONTRACT_VIEWER', 'SERVICE_CONTRACT_EDITOR', 'SERVICE_CONTRACT_APPROVER'] }
      },
      {
        path: 'search-bookings', component: BookingWrapperComponent, canActivate: [RoleGuardService],
        data: { requiredRoles: ['BOOKING_VIEWER', 'BOOKING_EDITOR', 'BOOKING_APPROVER'] }
      },
      {
        path: 'search-shipping-instructions',
        component: ShippingInstructionWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['SHIPPING_INSTRUCTION_VIEWER', 'SHIPPING_INSTRUCTION_EDITOR', 'SHIPPING_INSTRUCTION_APPROVER'] }
      },
      {
        path: 'search-freight-invoices', component: FreightInvoiceWrapperComponent, canActivate: [RoleGuardService],
        data: { requiredRoles: ['FREIGHT_INVOICE_VIEWER', 'FREIGHT_INVOICE_EDITOR', 'FREIGHT_INVOICE_APPROVER'] }
      },
      {
        path: 'search-credit-notes', component: CreditNoteWrapperComponent,
        data: { requiredRoles: ['FREIGHT_INVOICE_VIEWER', 'FREIGHT_INVOICE_EDITOR', 'FREIGHT_INVOICE_APPROVER'] }
      },
      {
        path: 'search-container-event', component: ContainerEventWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['CONTAINER_ALLOCATOR'] }
      },
      {
        path: 'search-container-stock', component: ContainerStockWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['CONTAINER_STOCK_VIEWER'] }
      },
      {
        path: 'search-disbursement-accounts',
        component: DisbursementAccountWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['DISBURSEMENT_ACCOUNT_EDITOR', 'DISBURSEMENT_ACCOUNT_APPROVER'] }
      },
      {
        path: 'search-commodity', component: CommodityWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['BOOKING_VIEWER'] }
      },
      {
        path: 'search-container', component: ContainerWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['BOOKING_VIEWER'] }
      },
      {
        path: 'search-container-lease-period', component: ContainerLeasePeriodWrapperComponent,
        canActivate: [RoleGuardService],
        data: { requiredRoles: ['CONTAINER_ALLOCATOR'] }
      },
      { path: 'search-repair-jobs', component: RepairJobWrapperComponent, canActivate: [MandrGuardService] },
      { path: 'routefinder', component: RouteFinderComponent },
      {
        path: 'mandr', canActivate: [MandrGuardService],
        children: [
          { path: 'repair-dash', component: RepairJobDashComponent },
          { path: 'repair-job', component: RepairJobListComponent },
          { path: 'repair-job-edit', component: RepairJobEditComponent },
          { path: 'repair-item', component: RepairItemListComponent },
          { path: 'repair-item-edit', component: RepairItemEditComponent },
          { path: 'approval-limits', component: ApprovalLimitsListComponent },
          { path: 'approval-limits-edit', component: ApprovalLimitsEditComponent }
        ]
      },
      {
        path: 'vendor-jobs', canActivate: [VendorjobsGuardService],
        children: [
          {
            path: 'tariff-list', component: ContainerJobTariffListComponent, children: [
              { path: '', redirectTo: 'lump-sum', pathMatch: 'full' },
              { path: 'lump-sum', component: ContainerJobTariffLumpSumListComponent },
              { path: 'labour-rate', component: ContainerJobTariffLabourRateListComponent }
            ]
          },
          { path: 'tariff-edit', component: ContainerJobTariffEditComponent }
        ]
      },
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
