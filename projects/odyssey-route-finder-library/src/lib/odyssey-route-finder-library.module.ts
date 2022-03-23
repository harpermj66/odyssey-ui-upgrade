import { NgModule } from '@angular/core';
import { OdysseyRouteFinderLibraryComponent } from './odyssey-route-finder-library.component';
import {ScheduleDetailComponent} from "./component/route-finder/schedule-result/schedule-summary/schedule-detail/schedule-detail.component";
import {ScheduleSummaryComponent} from "./component/route-finder/schedule-result/schedule-summary/schedule-summary.component";
import {ScheduleResultComponent} from "./component/route-finder/schedule-result/schedule-result.component";
import {ScheduleSearchParameterComponent} from "./component/route-finder/schedule-search-parameter/schedule-search-parameter.component";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../../shared/modules/material-module";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ScheduleDashboardSearchParameterComponent } from './component/route-finder/schedule-dashboard-search-parameter/schedule-dashboard-search-parameter.component';
import { ScheduleResultSortComponent } from './component/route-finder/schedule-result-sort/schedule-result-sort.component';


@NgModule({
  declarations: [
    OdysseyRouteFinderLibraryComponent,
    ScheduleSummaryComponent,
    ScheduleDetailComponent,
    ScheduleResultComponent,
    ScheduleSearchParameterComponent,
    ScheduleDashboardSearchParameterComponent,
    ScheduleResultSortComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports: [
    OdysseyRouteFinderLibraryComponent,
    ScheduleSummaryComponent,
    ScheduleDetailComponent,
    ScheduleResultComponent,
    ScheduleSearchParameterComponent,
    ScheduleDashboardSearchParameterComponent,
    ScheduleResultSortComponent,
  ]
})
export class OdysseyRouteFinderLibraryModule { }
