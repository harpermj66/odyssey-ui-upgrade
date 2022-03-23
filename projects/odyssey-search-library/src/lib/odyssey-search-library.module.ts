import {NgModule} from '@angular/core';
import {OdysseySearchLibraryComponent} from './odyssey-search-library.component';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "../../../shared/modules/material-module";
import {MatCardModule} from "@angular/material/card";
import {FlexLayoutModule} from "@angular/flex-layout";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {SearchComponent} from './search/search.component';
import {SavedComponent} from './search/saved/saved.component';
import {ServiceContractComponent} from './search/service-contract/service-contract.component';
import {QuoteComponent} from './search/quote/quote.component';
import {BookingComponent} from './search/booking/booking.component';
import {SIComponent} from './search/si/si.component';
import {FreightInvoiceComponent} from './search/freight-invoice/freight-invoice.component';
import {CNoteComponent} from './search/c-note/c-note.component';
import {DaComponent} from './search/da/da.component';
import {BookingListComponent} from './search/booking/booking-list/booking-list.component';
import {SearchRuleEditorComponent} from "./search/rule/editor/search-rule-editor/search-rule-editor.component";
import {
    SearchRuleEditorDateMatcherComponent
} from "./search/rule/editor/matcher/search-rule-editor-date-matcher/search-rule-editor-date-matcher.component";
import {
    SearchRuleEditorFieldRuleComponent
} from "./search/rule/editor/search-rule-editor-field-rule/search-rule-editor-field-rule.component";
import {
    SearchRuleEditorGenericMatcherComponent
} from "./search/rule/editor/matcher/search-rule-editor-generic-matcher/search-rule-editor-generic-matcher.component";
import {
    SearchRuleEditorGenericRuleComponent
} from "./search/rule/editor/search-rule-editor-generic-rule/search-rule-editor-generic-rule.component";
import {
    SearchRuleEditorMultiRuleComponent
} from "./search/rule/editor/search-rule-editor-multi-rule/search-rule-editor-multi-rule.component";
import {
    SearchRuleEditorNumberMatcherComponent
} from "./search/rule/editor/matcher/search-rule-editor-number-matcher/search-rule-editor-number-matcher.component";
import {
    SearchRuleEditorStringMatcherComponent
} from "./search/rule/editor/matcher/search-rule-editor-string-matcher/search-rule-editor-string-matcher.component";
import {
    SearchRuleEditorSortSelectorComponent
} from "./search/rule/editor/sort/search-rule-editor-sort-selection/search-rule-editor-sort-selector.component";
import {DetailedSearchComponent} from "./search/detailed-search/detailed-search.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {
    SearchRuleEditorGroupingComponent
} from "./search/rule/editor/grouping/search-rule-editor-grouping/search-rule-editor-grouping.component";
import {MdePopoverModule} from "@material-extended/mde";
import {SaveRuleComponent} from './search/rule/editor/save-rule/save-rule.component';
import {
    BookingGroupedTemplate1Component
} from './search/booking/booking-grouped-template1/booking-grouped-template1.component';
import {QuickSearchComponent} from './search/search-screen-template/quick-search/quick-search.component';
import {AdvancedSearchComponent} from './search/search-screen-template/advanced-search/advanced-search.component';
import {SearchScreenTemplateComponent} from './search/search-screen-template/search-screen-template.component';
import {QuoteWrapperComponent} from './search/quote/quote-wrapper/quote-wrapper.component';
import {
    ServiceContractWrapperComponent
} from './search/service-contract/service-contract-wrapper/service-contract-wrapper.component';
import {CreditNoteWrapperComponent} from './search/c-note/credit-note-wrapper/credit-note-wrapper.component';
import {
    FreightInvoiceWrapperComponent
} from './search/freight-invoice/freight-invoice-wrapper/freight-invoice-wrapper.component';
import {
    ShippingInstructionWrapperComponent
} from './search/si/shipping-instruction-wrapper/shipping-instruction-wrapper.component';
import {
    DisbursementAccountWrapperComponent
} from './search/da/disbursement-account-wrapper/disbursement-account-wrapper.component';
import {BookingWrapperComponent} from './search/booking/booking-wrapper/booking-wrapper.component';
import {RepairJobComponent} from "./search/repair-job/repair-job.component";
import {RepairJobWrapperComponent} from "./search/repair-job/repair-job-wrapper/repair-job-wrapper.component";
import {ContainerEventComponent} from './search/container-event/container-event.component';
import {
    ContainerEventWrapperComponent
} from './search/container-event/container-event-wrapper/container-event-wrapper.component';
import {ContainerStockComponent} from './search/container-stock/container-stock.component';
import {
    ContainerStockWrapperComponent
} from './search/container-stock/container-stock-wrapper/container-stock-wrapper.component';
import {ContainerComponent} from './search/container/container.component';
import {CommodityComponent} from './search/commodity/commodity.component';
import {ContainerWrapperComponent} from './search/container/container-wrapper/container-wrapper.component';
import {CommodityWrapperComponent} from './search/commodity/commodity-wrapper/commodity-wrapper.component';
import {ContainerLeasePeriodComponent} from './search/container-lease-period/container-lease-period.component';
import {
    ContainerLeasePeriodWrapperComponent
} from './search/container-lease-period/container-lease-period-wrapper/container-lease-period-wrapper.component';

@NgModule({
    declarations: [
        OdysseySearchLibraryComponent,
        SearchComponent,
        SavedComponent,
        ServiceContractComponent,
        QuoteComponent,
        BookingComponent,
        SIComponent,
        FreightInvoiceComponent,
        CNoteComponent,
        DaComponent,
        BookingListComponent,
        RepairJobComponent,
        SearchRuleEditorComponent,
        SearchRuleEditorDateMatcherComponent,
        SearchRuleEditorFieldRuleComponent,
        SearchRuleEditorGenericMatcherComponent,
        SearchRuleEditorGenericRuleComponent,
        SearchRuleEditorMultiRuleComponent,
        SearchRuleEditorNumberMatcherComponent,
        SearchRuleEditorStringMatcherComponent,
        SearchRuleEditorSortSelectorComponent,
        SearchRuleEditorGroupingComponent,
        DetailedSearchComponent,
        SaveRuleComponent,
        BookingGroupedTemplate1Component,
        QuickSearchComponent,
        AdvancedSearchComponent,
        SearchScreenTemplateComponent,
        QuoteWrapperComponent,
        ServiceContractWrapperComponent,
        CreditNoteWrapperComponent,
        FreightInvoiceWrapperComponent,
        ShippingInstructionWrapperComponent,
        DisbursementAccountWrapperComponent,
        BookingWrapperComponent,
        RepairJobWrapperComponent,
        ContainerEventComponent,
        ContainerEventWrapperComponent,
        ContainerComponent,
        CommodityComponent,
        ContainerWrapperComponent,
        CommodityWrapperComponent,
        ContainerStockComponent,
        ContainerStockWrapperComponent,
        ContainerLeasePeriodComponent,
        ContainerLeasePeriodWrapperComponent
    ],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
    RouterModule,
    MdePopoverModule,
  ],
  exports: [
    OdysseySearchLibraryComponent,
    SearchComponent
  ],
  providers: [
  ]
})
export class OdysseySearchLibraryModule { }
