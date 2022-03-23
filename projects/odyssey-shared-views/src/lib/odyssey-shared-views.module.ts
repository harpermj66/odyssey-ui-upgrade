import {NgModule} from '@angular/core';
import {OdysseySharedViewsComponent} from './odyssey-shared-views.component';
import {HeaderToolbarComponent} from './header-toolbar/header-toolbar.component';
import {MaterialModule} from "../../../shared/modules/material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ModuleComponent} from './odyssey-module/module.component';
import {SubheaderToolbarComponent} from './subheader-toolbar/subheader-toolbar.component';
import {CommonModule} from "@angular/common";
import {SigninComponent} from "./signin/signin.component";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {
    ModuleNavigatorService
} from "../../../odyssey-service-library/src/lib/module-navigation/module-navigator.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoDataFoundComponent} from './component/no-data-found/no-data-found.component';
import {ListFilterComponent} from './component/list-filter/list-filter.component';
import {LegacyMenuComponent} from './legacy-menu/legacy-menu.component';
import {OdysseyRouterComponent} from './component/odyssey-router/odyssey-router.component';
import {ListFilterItemComponent} from './component/list-filter/list-filter-item/list-filter-item.component';
import {SearchTypeComponent} from './search/search-type/search-type.component';
import {WorkInProgressComponent} from './component/work-in-progress/work-in-progress.component';
import {
    StandardListPageHeaderComponent
} from './component/standard-list-page-header/standard-list-page-header.component';
import {AdvancedSearchToolbarComponent} from './search/advanced-search-toolbar/advanced-search-toolbar.component';
import {SidebarWideComponent} from './sidebar-menus/sidebar-wide/sidebar-wide.component';
import {HeaderToolbarHomeComponent} from './header-toolbar-home/header-toolbar-home.component';
import {SidebarIconComponent} from './sidebar-menus/sidebar-icon/sidebar-icon.component';
import {WelcomePageToolbarComponent} from './welcome-page-toolbar/welcome-page-toolbar.component';
import {
    UnsavedChangesDialogComponent
} from "./component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {ConfirmDeleteDialogComponent} from "./component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";
import {
    AddAttachmentsDialogComponent
} from "./component/dialog/add-attachments-dialog/add-attachments-dialog.component";
import {RemoveExtensionPipe} from "./pipes/remove-extension.pipe";
import {
    StandardDataGridTemplateComponent
} from './datagrid/standard-data-grid-template/standard-data-grid-template.component';
// tslint:disable:max-line-length
import {
    DataGridGroupedSumsTemplate1Component
} from './datagrid/data-grid-grouped-sums-template1/data-grid-grouped-sums-template1.component';
import {DataGridNavigatorComponent} from './datagrid/data-grid-navigator/data-grid-navigator.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FavouritesComponent} from './favourites/favourites.component';
import {ManageFavouritesComponent} from './favourites/manage-favourites/manage-favourites.component';
import {SlideRightViewToolbarComponent} from './slide-right-view-toolbar/slide-right-view-toolbar.component';
import {BasicFilterComponent} from "./component/basic-filter/basic-filter.component";
import {ContentWrapperComponent} from "./component/content-wrapper/content-wrapper.component";
import {HelpMenuComponent} from './help/help-menu/help-menu.component';
import {HelpEmbeddedViewComponent} from './help/help-embedded-view/help-embedded-view.component';
import {SafeResourceUrlPipe} from './pipes/safe-resource-url.pipe';
import {AreYouSureDialogComponent} from './component/dialog/are-you-sure-dialog/are-you-sure-dialog.component';
import {SidebarCompositeComponent} from './sidebar-menus/sidebar-composite/sidebar-composite.component';
import {LookupService} from '../../../odyssey-service-library/src/lib/lookup/service/lookup.service';
import {LookupSelectOneComponent} from "./lookup/lookup-select-one/lookup-select-one.component";
import {UnLocodeLookupComponent} from './lookup/unlocode-lookup/un-locode-lookup.component';
import {LookupAutocompleteComponent} from "./lookup/lookup-autocomplete/lookup-autocomplete.component";
import {ItineraryViewComponent} from './views/itinerary-view/itinerary-view.component';

@NgModule({
  declarations: [
    OdysseySharedViewsComponent,
    HeaderToolbarComponent,
    ModuleComponent,
    SubheaderToolbarComponent,
    SigninComponent,
    NoDataFoundComponent,
    ListFilterComponent,
    LegacyMenuComponent,
    OdysseyRouterComponent,
    ListFilterItemComponent,
    SearchTypeComponent,
    WorkInProgressComponent,
    StandardListPageHeaderComponent,
    AdvancedSearchToolbarComponent,
    SidebarWideComponent,
    HeaderToolbarHomeComponent,
    SidebarIconComponent,
    WelcomePageToolbarComponent,
    UnsavedChangesDialogComponent,
    ConfirmDeleteDialogComponent,
    StandardDataGridTemplateComponent,
    DataGridGroupedSumsTemplate1Component,
    DataGridNavigatorComponent,
    ConfirmDeleteDialogComponent,
    AddAttachmentsDialogComponent,
    RemoveExtensionPipe,
    FavouritesComponent,
    ManageFavouritesComponent,
    SlideRightViewToolbarComponent,
    BasicFilterComponent,
    ContentWrapperComponent,
    HelpMenuComponent,
    HelpEmbeddedViewComponent,
    SafeResourceUrlPipe,
    SafeResourceUrlPipe,
    AreYouSureDialogComponent,
    SidebarCompositeComponent,
    UnLocodeLookupComponent,
    LookupSelectOneComponent,
    LookupAutocompleteComponent,
    ItineraryViewComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    OdysseyServiceLibraryModule
  ],
  exports: [
    OdysseySharedViewsComponent,
    HeaderToolbarComponent,
    ModuleComponent,
    SubheaderToolbarComponent,
    SigninComponent,
    NoDataFoundComponent,
    ListFilterComponent,
    LegacyMenuComponent,
    OdysseyRouterComponent,
    SearchTypeComponent,
    WorkInProgressComponent,
    StandardListPageHeaderComponent,
    AdvancedSearchToolbarComponent,
    SidebarWideComponent,
    SidebarIconComponent,
    HeaderToolbarHomeComponent,
    WelcomePageToolbarComponent,
    UnsavedChangesDialogComponent,
    ConfirmDeleteDialogComponent,
    AddAttachmentsDialogComponent,
    RemoveExtensionPipe,
    ConfirmDeleteDialogComponent,
    StandardDataGridTemplateComponent,
    DataGridGroupedSumsTemplate1Component,
    DataGridNavigatorComponent,
    FavouritesComponent,
    ManageFavouritesComponent,
    SlideRightViewToolbarComponent,
    BasicFilterComponent,
    ContentWrapperComponent,
    SidebarCompositeComponent,
    UnLocodeLookupComponent,
    LookupSelectOneComponent,
    LookupAutocompleteComponent
  ],
  providers: [
    ModuleNavigatorService,
    LookupService
  ]
})
export class OdysseySharedViewsModule {
}
