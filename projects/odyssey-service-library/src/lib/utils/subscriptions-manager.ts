import {Subscription} from "rxjs";
import {ChangeDetectorRef, Injectable, OnDestroy} from "@angular/core";
import {ChangeDetector} from "./change-detector";

/**
 * A class that manages subscriptions and other connections between components that should be
 * destroyed/unsubscribed when the parent component is destroyed.
 * Calls their destroy/unsubscribe methods during the on destroy phase.
 */
@Injectable()
export class SubscriptionsManager implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private namedIntervals: {[name: string]: number} = {};
  private intervals: number[] = [];
  private destroyables: OnDestroy[] = [];
  private changeDetectors: ChangeDetectorRef[] = [];

  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Unsubscribes from all managed subscriptions, clears all managed intervals.
   */
  public destroy(): void {
    this.subscriptions.forEach(
      sub => {
        if(sub) {
          sub.unsubscribe();
        }
      }
    );

    Object.getOwnPropertyNames(this.namedIntervals).forEach(
      prop => {
        const interval = this.namedIntervals[prop];
        if(interval) {
          clearInterval(interval);
        }
      }
    );

    this.intervals.forEach(
      interval => {
        if(interval) {
          clearInterval(interval);
        }
      }
    );

    this.destroyables.filter(
      dest => {
        if(dest) {
          dest.ngOnDestroy();
        }
      }
    );

    this.changeDetectors.filter(
      cd => {
        if(cd) {
          ChangeDetector.destroy(cd);
        }
      }
    );
  }

  public addSub(subscription: Subscription): Subscription {
    if(!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
    return subscription;
  }

  public removeSub(subscription: Subscription): Subscription {
    const index = this.subscriptions.indexOf(subscription);
    if(index >= 0) {
      this.subscriptions.splice(index, 1);
    }
    return subscription;
  }

  public addInterval(interval: number): number {
    if(!this.intervals.includes(interval)) {
      this.intervals.push(interval);
    }
    return interval;
  }

  public removeInterval(interval: number): number {
    const index = this.intervals.indexOf(interval);
    if(index >= 0) {
      this.intervals.splice(index, 1);
    }
    return interval;
  }

  public addDestroyable(interval: OnDestroy): OnDestroy {
    if(!this.destroyables.includes(interval)) {
      this.destroyables.push(interval);
    }
    return interval;
  }

  public removeDestroyable(interval: OnDestroy): OnDestroy {
    const index = this.destroyables.indexOf(interval);
    if(index >= 0) {
      this.destroyables.splice(index, 1);
    }
    return interval;
  }

  public addChangeDetector(changeDetector: ChangeDetectorRef): ChangeDetectorRef {
    if(!this.changeDetectors.includes(changeDetector)) {
      this.changeDetectors.push(changeDetector);
    }
    return changeDetector;
  }

  public removeChangeDetector(changeDetector: ChangeDetectorRef): ChangeDetectorRef {
    const index = this.changeDetectors.indexOf(changeDetector);
    if(index >= 0) {
      this.changeDetectors.splice(index, 1);
    }
    return changeDetector;
  }
}
