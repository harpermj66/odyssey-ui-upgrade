import { Injectable } from '@angular/core';

// tslint:disable-next-line:jsdoc-format
/** This class is not in use currently and would need to be reworked if used **/
@Injectable({
  providedIn: 'root'
})
export class ModuleNavigatorService {

  homeWindowName = 'Odyssey Home';
  homePageUrl = '';
  adminWindowName = 'Odyssey Administration';
  adminPageUrl = '';

  constructor() { }

  openHomeModule(): void  {
    this.openModule(4200, 'home', this.homePageUrl, this.homeWindowName);
  }

  openAdministrationModule(): void {
    this.openModule(4201, 'administration', this.adminPageUrl, this.adminWindowName);
  }

  openModule(port: number, context: string, pageUrl: string, windowName: string): void {
    let url = '';
    if (window.location.port.startsWith('42')) {
      url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/' + context;
    } else {
      url = window.location.origin + '/' + context + '/';
    }

    if (pageUrl.length === 0) {
      pageUrl = url;
    }
    window.open(pageUrl, windowName);
  }
}
