import { NgModule } from '@angular/core';
import { OdysseyAdministrationLibraryComponent } from './odyssey-administration-library.component';
import {UsersComponent} from "./users/users.component";
import {UserListComponent} from "./users/user-list/user-list.component";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from "../../../shared/modules/material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {OdysseySharedViewsModule} from "../../../odyssey-shared-views/src/lib/odyssey-shared-views.module";
import {OdysseyServiceLibraryModule} from "../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {MatCardModule} from "@angular/material/card";
import {UserEditComponent} from "./users/user-edit/user-edit.component";

@NgModule({
  declarations: [
    OdysseyAdministrationLibraryComponent,
    UsersComponent,
    UserEditComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MatCardModule,
    FlexLayoutModule,
    OdysseySharedViewsModule,
    OdysseyServiceLibraryModule,
  ],
  exports: [OdysseyAdministrationLibraryComponent]
})
export class OdysseyAdministrationLibraryModule { }
