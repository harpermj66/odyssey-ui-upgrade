import {Injectable, OnDestroy} from "@angular/core";
import {SubscriptionsManager} from "../../utils/subscriptions-manager";
import {AuthenticatedUser, AuthenticationService} from "../../authentication/authentication.service";
import {OdysseyLegacyService} from "../../../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";
import {Router} from "@angular/router";

/**
 * Service to keep legacy and microservices systems alive.
 */
@Injectable()
export class ActivityService implements OnDestroy {

  private _timeTilTimeoutMillis?: number;

  private heartbeatIntervalMillis = 30000;

  private lastActivityMillis = Date.now();
  private lastHeartbeatMillis = Date.now();
  private activityDetected = false;

  private subscriptionsManager: SubscriptionsManager = new SubscriptionsManager();

  private heartbeatInterval?: number;
  private checkTimeoutInterval?: number;

  constructor(private authenticationService: AuthenticationService,
              private odysseyLegacyService: OdysseyLegacyService,
              private router: Router) {
    this.createHeartbeatInterval();
    this.createCheckTimeoutInterval();
    this.subscriptionsManager.addSub(authenticationService.authenticationStatusChanged.subscribe(this.onAuthStatusChanged.bind(this)));
  }

  ngOnDestroy(): void {
    this.subscriptionsManager.destroy();
  }

  get timeTilTimeoutMillis(): number | undefined {
      return this._timeTilTimeoutMillis;
  }

  /**
   * Call to indicate there has been some activity on the legacy UI.
   */
  legacyActivity(): void {
    this.signalActivity();
  }

  /**
   * Call to indicate there has been some activity on the angular UI.
   */
  activity(): void {
    this.signalActivity();
  }

  private createHeartbeatInterval(interval?: number): number {
    if (this.heartbeatInterval) {
      this.subscriptionsManager.removeInterval(this.heartbeatInterval);
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(this.sendHeartbeat.bind(this), interval ? interval : this.heartbeatIntervalMillis);
    this.subscriptionsManager.addInterval(this.heartbeatInterval);
    return this.heartbeatInterval;
  }

  private createCheckTimeoutInterval(): number {
    if (this.checkTimeoutInterval) {
      this.subscriptionsManager.removeInterval(this.checkTimeoutInterval);
      clearInterval(this.checkTimeoutInterval);
    }
    this.checkTimeoutInterval = setInterval(this.checkTimeout.bind(this), 1000);
    this.subscriptionsManager.addInterval(this.checkTimeoutInterval);
    return this.checkTimeoutInterval;
  }

  private signalActivity(): void {
    const currentMillis = Date.now();
    const previousActivityMillis = this.lastActivityMillis;
    this.lastActivityMillis = currentMillis;
    this.activityDetected = true;

    if (previousActivityMillis + this.heartbeatIntervalMillis < currentMillis) {
      // If it has been long enough instantly send the heartbeat to make sure
      // the sessions do not time out before the interval sends the heartbeat
      this.sendHeartbeat();
    }
  }

  /**
   * Heartbeat for the microservices tokens.
   * @private
   */
  private heartbeat(): void {
    // Make a call to refresh the user permissions and roles from the remote service. Should keep the oauth tokens alive.
    this.authenticationService.refreshUser();
  }

  /**
   * Heartbeat for legacy odyssey.
   * @private
   */
  private legacyHeartbeat(): void {
    this.odysseyLegacyService.sendMessage({action: "heartbeat"});
  }

  /**
   * Send a heartbeat to legacy and microservice systems.
   * @private
   */
  private sendHeartbeat(): void {
    if (this.authenticationService.isAuthenticated() && this.activityDetected) {
      this.activityDetected = false;
      this.lastHeartbeatMillis = Date.now();
      this.heartbeat();
      this.legacyHeartbeat();
    }
  }

  private checkTimeout(): void {
    if (this.authenticationService.isAuthenticated()) {
      this._timeTilTimeoutMillis = (this.lastHeartbeatMillis + this.authenticationService.sessionTimeoutMillis) - Date.now();
      if (this._timeTilTimeoutMillis <= 0) {
        this.authenticationService.logout().subscribe(() => {
          this.router.navigate(['cover-page']);
        });
      }
    } else {
      // Keep updating so the log in process does not trigger the timeout
      this.lastHeartbeatMillis = Date.now();
      this.lastActivityMillis = Date.now();
    }
  }

  private onAuthStatusChanged(user: AuthenticatedUser): void {
    if (!!user) {
      // Reset for a new user
      this.lastActivityMillis = Date.now();

      if (this.heartbeatIntervalMillis > this.authenticationService.sessionTimeoutMillis) {
        // The unlikely case our heartbeat interval is too low
        this.createHeartbeatInterval(Math.ceil(this.authenticationService.sessionTimeoutMillis / 2));
      } else {
        this.createHeartbeatInterval();
      }
    }
  }
}
