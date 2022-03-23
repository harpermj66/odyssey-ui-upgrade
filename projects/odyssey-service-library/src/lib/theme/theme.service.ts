import {Injectable} from "@angular/core";
import {LocalStorageService} from "../localstorage/localstorage.service";
import {ActivatedRoute, Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  static readonly MARFRET = 'MARFRET';
  static readonly MARFRET_FULL_NAME = 'Compagnie Maritime Marfret';
  static readonly MARFRET_THEME = 'marfret-theme';
  static readonly MARFRET_LOGO = 'marfret/logo.png';
  static readonly MARFRET_LOGO_HEIGHT = '76';
  static readonly MARFRET_PADDING = '1px';
  static readonly MARFRET_AUTH_HEIGHT = '76';

  static readonly LOCUS = 'LOCUS';
  static readonly LOCUS_THEME = 'locus-theme';
  static readonly LOCUS_LOGO = 'logo.png';
  static readonly LOCUS_LOGO_HEIGHT = '40';
  static readonly LOCUS_PADDING = '0px';
  static readonly LOCUS_AUTH_HEIGHT = '0';

  static readonly NCL = 'NCL';
  static readonly NCL_FULL_NAME = 'North Sea Container Line AS';
  static readonly NCL_THEME = 'ncl-theme';
  static readonly NCL_LOGO = 'ncl/logo.png';
  static readonly NCL_LOGO_HEIGHT = '72';
  static readonly NCL_PADDING = '10px';
  static readonly NCL_AUTH_HEIGHT = '71';

  static readonly DAL = 'DAL';
  static readonly DAL_FULL_NAME = 'DAL Deutsche Afrika-Linien GmbH & Co. KG';
  static readonly DAL_THEME = 'dal-theme';
  static readonly DAL_LOGO = 'dal/logo.svg';
  static readonly DAL_LOGO_HEIGHT = '40';
  static readonly DAL_PADDING = '6px';
  static readonly DAL_AUTH_HEIGHT = "40";

  static readonly TRANSMAR = 'TRANSMAR';
  static readonly TRANSMAR_FULL_NAME = 'Transmar International Shipping';
  static readonly TRANSMAR_THEME = 'transmar-theme\'';
  static readonly TRANSMAR_LOGO = 'transmar/logo.png';
  static readonly TRANSMAR_LOGO_HEIGHT = '44';
  static readonly TRANSMAR_PADDING = '10px';
  static readonly TRANSMAR_AUTH_HEIGHT = "52";

  static readonly EIMSKIP = 'EIMSKIP';
  static readonly EIMSKIP_FULL_NAME = 'EIMSKIP';
  static readonly EIMSKIP_THEME = 'eimskip-theme';
  static readonly EIMSKIP_LOGO = 'eimskip/eimskip-black.png';
  static readonly EIMSKIP_LOGO_HEIGHT = '40';
  static readonly EIMSKIP_PADDING = '1px';
  static readonly EIMSKIP_AUTH_HEIGHT = '36';

  static readonly CARRIER = 'carrier';

  appTheme = 'locus-theme';
  appLogo = 'locus-software-white.png';
  appLogoHeight = '26';
  headerPadding = '10px';
  authHeight = '26';

  private currentCarrier = '';
  private currentCarrierFullName = '';

  constructor(public localStorageService: LocalStorageService) {}

  setThemeFromUrl(route: ActivatedRoute): void {
    let foundCarrier = false;

    route.queryParams.forEach((value: Params) => {
      if (value.carrier) {
        this.changeTheme(value.carrier);
        foundCarrier = true;
      }
    });

    if (!foundCarrier) {
      this.changeTheme('Locus');
    }
  }

  changeTheme(theme: string): void {
    console.log('Theme ***** ' + theme)
    switch (theme.toUpperCase()) {
      case ThemeService.TRANSMAR: {
        this.setAttributes(ThemeService.TRANSMAR_THEME, ThemeService.TRANSMAR_LOGO, ThemeService.TRANSMAR_LOGO_HEIGHT,
          ThemeService.TRANSMAR_PADDING, ThemeService.TRANSMAR_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.TRANSMAR;
        this.currentCarrierFullName = ThemeService.TRANSMAR_FULL_NAME;
        break;
      }
      case ThemeService.MARFRET: {
        this.setAttributes(ThemeService.MARFRET_THEME, ThemeService.MARFRET_LOGO, ThemeService.MARFRET_LOGO_HEIGHT,
          ThemeService.MARFRET_PADDING, ThemeService.MARFRET_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.MARFRET;
        this.currentCarrierFullName = ThemeService.MARFRET_FULL_NAME;
        break;
      }
      case ThemeService.NCL: {
        this.setAttributes(ThemeService.NCL_THEME, ThemeService.NCL_LOGO, ThemeService.NCL_LOGO_HEIGHT, ThemeService.NCL_PADDING,
          ThemeService.NCL_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.NCL;
        this.currentCarrierFullName = ThemeService.NCL_FULL_NAME;
        break;
      }
      case ThemeService.DAL: {
        this.setAttributes(ThemeService.DAL_THEME, ThemeService.DAL_LOGO, ThemeService.DAL_LOGO_HEIGHT, ThemeService.DAL_PADDING,
          ThemeService.DAL_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.DAL;
        this.currentCarrierFullName = ThemeService.DAL_FULL_NAME;
        break;
      }
      case ThemeService.EIMSKIP: {
        this.setAttributes(ThemeService.EIMSKIP_THEME, ThemeService.EIMSKIP_LOGO, ThemeService.EIMSKIP_LOGO_HEIGHT,
            ThemeService.EIMSKIP_PADDING, ThemeService.EIMSKIP_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.EIMSKIP;
        this.currentCarrierFullName = ThemeService.EIMSKIP_FULL_NAME;
        break;
      }
      default: {
        this.setAttributes(ThemeService.LOCUS_THEME, ThemeService.LOCUS_LOGO, ThemeService.LOCUS_LOGO_HEIGHT, ThemeService.LOCUS_PADDING,
          ThemeService.LOCUS_AUTH_HEIGHT);
        this.currentCarrier = ThemeService.LOCUS;
        break;
      }
    }
  }

  setAttributes(theme: string, logo: string, logoHeight: string, headerPadding: string, authHeight: string): void {
    this.appTheme = theme;
    this.appLogo = logo;
    this.appLogoHeight = logoHeight;
    this.headerPadding = headerPadding;
    this.authHeight = authHeight;
  }

  getCurrentCarrier(): string {
    if (this.currentCarrier === ThemeService.LOCUS) {
      return '';
    } else {
      return this.currentCarrier;
    }
  }

  getCurrentCarrierFullName(): string {
    return this.currentCarrier === ThemeService.LOCUS ? '' : this.currentCarrierFullName;
  }
}
