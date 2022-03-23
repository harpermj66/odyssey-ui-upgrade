import {AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {LegacyMessage, OdysseyLegacyService} from "./odyssey-legacy-service";
import {AuthenticationService} from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ActivityService} from "../../../../odyssey-service-library/src/lib/session/service/activity.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SubscriptionsManager} from "../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {environment} from "../../environments/environment";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'app-odyssey-legacy-page',
  templateUrl: './odyssey-legacy-page.component.html',
  styleUrls: ['./odyssey-legacy-page.component.scss'],
  providers: [SubscriptionsManager]
})
export class OdysseyLegacyPageComponent implements OnInit, AfterViewInit {

  private odysseyFrame: HTMLIFrameElement;

  standardOffset = 50;
  contentHeight = 800;

  odysseyServer: string;
  odysseyInstanceUrl: string;
  odysseyInstanceUrlWithParams: SafeResourceUrl;
  pageReady = false;

  loaded = false;
  subscribed = false;

  constructor(public odysseyLegacyService: OdysseyLegacyService,
              public authenticationService: AuthenticationService,
              private activityService: ActivityService,
              public sanitizer: DomSanitizer,
              private subscriptionsManager: SubscriptionsManager,
              private eleRef: ElementRef,
              private themeService: ThemeService,
  ) {

    console.log(environment.odysseyInstanceUrl);
    console.log(environment.odysseyHost);
    this.odysseyInstanceUrl = environment.odysseyInstanceUrl;
    this.setupOdysseyUrl();
    this.odysseyServer = environment.odysseyHost;

    subscriptionsManager.addSub(odysseyLegacyService.accessTokenChanged.subscribe(token => {
      if(token) {
        this.setSessionData();
      }
    }));
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  setupOdyssey(odysseyFrame: HTMLIFrameElement): void {

    if (!this.odysseyFrame || this.odysseyFrame !== odysseyFrame) {
      this.setupFrame(odysseyFrame);
    }

    const iframeContent = this.odysseyFrame.contentWindow;
    if (!this.loaded && iframeContent) {
      this.setSessionData();
      this.loaded = true;
      this.pageReady = false;

      // Start poking the system to see if it is ready, it should respond with a ready message
      const readyInterval = setInterval(() => {
        if(!this.pageReady) {
          this.sendMessage({action: 'ready?'});
        } else {
          clearInterval(readyInterval);
        }
      }, 500);

      this.subscriptionsManager.addInterval(readyInterval);
    }

    if (this.loaded && !this.subscribed) {
      this.subscribeToMenuChanges();
      this.subscribed = true;
    }

  }

  setSessionData(): void {
    const iframeContent = this.odysseyFrame?.contentWindow;
    if (iframeContent) {
      const msg: LegacyMessage = {
        action: 'login',
        payload: {
          token: this.odysseyLegacyService.accessToken,
          carrierForUrl: this.themeService.getCurrentCarrier()
        }
      };
      iframeContent.postMessage(msg, '*');
    }
  }

  setupOdysseyUrl(): void {
    const url = this.odysseyInstanceUrl;
    this.odysseyInstanceUrlWithParams = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  subscribeToMenuChanges(): void {
    this.odysseyLegacyService.menuChanged.subscribe(menu => {
      this.openMenu(menu);
    });

    this.odysseyLegacyService.messageSent.subscribe(message => {
      this.sendMessage(message);
    });
  }

  openMenu(menu: LegacyMessage): void {
    const iframeContent = this.odysseyFrame?.contentWindow;
    if (iframeContent) {
      iframeContent.postMessage(menu, '*');
      setTimeout(() => {
        this.onResize();
      }, 2000);
    }
  }

  sendMessage(message: LegacyMessage): void {
    const iframeContent = this.odysseyFrame?.contentWindow;
    if (iframeContent) {
      iframeContent.postMessage(message, '*');
    }
  }

  private setupFrame(odysseyFrame: HTMLIFrameElement): void {
    this.odysseyFrame = odysseyFrame;
  }

  @HostListener('window:message', ['$event']) private receiveMessage(event: any): void {
    if (event.data && event.data === 'heartbeat') {
      this.activityService.legacyActivity();
    } else if(event.data && event.data === 'ready') {
      // Ody says it is ready to receive messsages
      this.pageReady = true;
      this.setSessionData();
    }
  }

  onResize(): void {
    if (this.eleRef.nativeElement.offsetParent != null && this.eleRef.nativeElement.offsetParent.clientHeight != null) {
      const totalHeight = this.eleRef.nativeElement.offsetParent.clientHeight;
      this.contentHeight = totalHeight - this.standardOffset;
    }

  }
}
