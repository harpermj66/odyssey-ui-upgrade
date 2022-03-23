import {ThemeService} from "./theme.service";
import {TestBed} from "@angular/core/testing";
import {LocalStorageService} from "../localstorage/localstorage.service";


describe('ThemeService', () => {

  let themeService: ThemeService;
  let localStorageServiceSpy: any;

  beforeEach(() => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getData', 'setData']);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {provide: LocalStorageService, useValue: localStorageServiceSpy}
      ]
    });

    themeService = TestBed.inject(ThemeService);
  });

  it('MARFRET theme change sets properties correctly', () => {
    themeService.changeTheme(ThemeService.MARFRET);

    expect(themeService.appTheme).toBe(ThemeService.MARFRET_THEME);
    expect(themeService.appLogo).toBe(ThemeService.MARFRET_LOGO);
    expect(themeService.headerPadding).toBe(ThemeService.MARFRET_PADDING);
    expect(themeService.appLogoHeight).toBe(ThemeService.MARFRET_LOGO_HEIGHT);
  });

  it('LOCUS theme change sets properties correctly', () => {
    themeService.changeTheme(ThemeService.LOCUS);

    expect(themeService.appTheme).toBe(ThemeService.LOCUS_THEME);
    expect(themeService.appLogo).toBe(ThemeService.LOCUS_LOGO);
    expect(themeService.headerPadding).toBe(ThemeService.LOCUS_PADDING);
    expect(themeService.appLogoHeight).toBe(ThemeService.LOCUS_LOGO_HEIGHT);
  });

  it('NCL theme change sets properties correctly', () => {
    themeService.changeTheme(ThemeService.NCL);

    expect(themeService.appTheme).toBe(ThemeService.NCL_THEME);
    expect(themeService.appLogo).toBe(ThemeService.NCL_LOGO);
    expect(themeService.headerPadding).toBe(ThemeService.NCL_PADDING);
    expect(themeService.appLogoHeight).toBe(ThemeService.NCL_LOGO_HEIGHT);
  });

  it('DAL theme change sets properties correctly', () => {
    themeService.changeTheme(ThemeService.DAL);

    expect(themeService.appTheme).toBe(ThemeService.DAL_THEME);
    expect(themeService.appLogo).toBe(ThemeService.DAL_LOGO);
    expect(themeService.headerPadding).toBe(ThemeService.DAL_PADDING);
    expect(themeService.appLogoHeight).toBe(ThemeService.DAL_LOGO_HEIGHT);
  });

  it('TRANSMAR theme change sets properties correctly', () => {
    themeService.changeTheme(ThemeService.TRANSMAR);

    expect(themeService.appTheme).toBe(ThemeService.TRANSMAR_THEME);
    expect(themeService.appLogo).toBe(ThemeService.TRANSMAR_LOGO);
    expect(themeService.headerPadding).toBe(ThemeService.TRANSMAR_PADDING);
    expect(themeService.appLogoHeight).toBe(ThemeService.TRANSMAR_LOGO_HEIGHT);
  });

});
