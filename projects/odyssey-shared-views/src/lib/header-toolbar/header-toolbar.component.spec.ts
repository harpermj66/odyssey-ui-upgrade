import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderToolbarComponent } from './header-toolbar.component';
import {MaterialModule} from "../../../../shared/modules/material-module";
import {OdysseyServiceLibraryModule} from "../../../../odyssey-service-library/src/lib/odyssey-service-library.module";
import {CommonModule} from "@angular/common";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {AuthenticationService} from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('HeaderToolbarComponent', () => {

  let headerToolbarComponent: HeaderToolbarComponent;
  let fixture: ComponentFixture<HeaderToolbarComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule,OdysseyServiceLibraryModule,CommonModule,HttpClientTestingModule],
      providers: [
        AuthenticationService, ThemeService
      ]
    })
    .compileComponents()
    .then(() => {
        fixture = TestBed.createComponent(HeaderToolbarComponent);
        headerToolbarComponent = fixture.componentInstance;
        el = fixture.debugElement;
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderToolbarComponent);
    headerToolbarComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(headerToolbarComponent).toBeTruthy();
  });

  it('Should display the header toolbar in the correct css selector', () => {
    const headerToolbar = el.queryAll(By.css('.headerToolbar'));
    expect(headerToolbar).toBeTruthy('Could not find header');
  });

  it('Should display sign in label if not authenticated', () => {
    const signInLabel = el.queryAll(By.css('.signInLabel'));
    expect(signInLabel).toBeTruthy('Could not find sign in label');
  });

  it('Should display sign out div if authenticated', () => {
    headerToolbarComponent.authenticated = true;
    fixture.detectChanges();
    const signOutDev = el.queryAll(By.css('.signOut'));
    expect(signOutDev).toBeTruthy('Could find not sign out div');
  });


});
