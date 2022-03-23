import {Injectable, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

export class LegacyMessage {
  action: 'heartbeat' | 'login' | 'logout' | 'ready?' | 'redirect-and-set-vendor-job' | 'menu-change';
  payload?: any;
}

@Injectable()
export class OdysseyLegacyService implements OnDestroy {

  menuChanged = new Subject<LegacyMessage>();
  messageSent = new Subject<LegacyMessage>();

  private _accessToken?: string | null;
  accessTokenChanged = new Subject<string | null | undefined>();

  public legacyView = false;

  constructor() {
  }

  changeMenu(menu: string): void {
    this.changeMenuMsg({action: "menu-change", payload: menu});
  }

  changeMenuMsg(menu: LegacyMessage): void {
    this.menuChanged.next(menu);

    if (!this.legacyView) {
      setTimeout(() => {
        this.legacyView = true;
      }, 1000);
    }
  }

  sendMessage(message: LegacyMessage): void {
    this.messageSent.next(message);
  }

  set accessToken(token: string | null | undefined) {
    this._accessToken = token;
    this.accessTokenChanged.next(token);
  }

  get accessToken(): string | null | undefined {
    return this._accessToken;
  }

  ngOnDestroy(): void {
    if (this.menuChanged != null) {
      this.menuChanged.unsubscribe();
    }
  }

  logout(): void {
    this.messageSent.next({action: "logout"});
  }
}
