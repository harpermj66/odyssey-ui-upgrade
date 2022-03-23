import {OnDestroy} from "@angular/core";
import {Observable, Subscription} from "rxjs";

/**
 * A simple request queue that allows for a single running request and queues all other requests in the order they are added.
 */
export abstract class AbstractRequestQueue {
  protected _loading = false;
  protected queued: QueuedRequest<any>[] = [];

  protected subscription?: Subscription;

  /**
   * Is the queue is currently busy loading.
   */
  public get loading(): boolean {
    // This should be read-only publicly
    return this._loading;
  }

  /**
   * Make a request or queue it if a request is already loading.
   *
   * @param observableOrFunc The request to make, or a function that builds the request to make
   * just before the request is called.
   * @param successFunc The function to call on request success.
   * @param errorFunc The function to call on failure.
   */
  public makeRequest<T>(observableOrFunc: Observable<T> | (() => Observable<T> | null),
                        successFunc?: (result: T) => void,
                        errorFunc?: (error: any) => void): void {
    this.execute(observableOrFunc, successFunc, errorFunc);
  }

  public destroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public cancelRequests(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.queued = [];
  }

  protected execute<T>(observableOrFunc: Observable<T> | (() => Observable<T> | null),
                       successFunc?: (result: T) => void,
                       errorFunc?: (error: any) => void): void {
    if(!this.loading) {
      this._loading = true;

      if(this.subscription) {
        this.subscription.unsubscribe();
      }

      let observable: Observable<T> | null;
      if(observableOrFunc instanceof Observable) {
        observable = observableOrFunc;
      } else {
        observable = observableOrFunc();
      }

      if(!observable) {
        this.onLoadComplete();
        return;
      }

      try {
        this.subscription = observable.subscribe(
          results => {
            if(successFunc) {
              try {
                successFunc(results);
              } catch (e) {
                console.error(e);
              }
            }
            this.onLoadComplete();
          },
          error => {
            // Do not call the error func if the request was cancelled
            if(errorFunc) {
              try {
                errorFunc(error);
              } catch (e) {
                console.error(e);
              }
            }
            this.onLoadComplete();
          }
        );
      } catch(e) {
        this.onLoadComplete();
      }

    } else {
      this.addToQueue(observableOrFunc, successFunc, errorFunc);
    }
  }

  /**
   * Added a request to the queue.
   *
   * @param observableOrFunc The request to make, or a function that builds the request to make
   * just before the request is called.
   * @param successFunc The function to call on request success.
   * @param errorFunc The function to call on failure.
   * @protected
   */
  protected abstract addToQueue<T>(observableOrFunc: Observable<T> | (() => Observable<T> | null),
                                   successFunc?: (result: T) => void,
                                   errorFunc?: (error: any) => void): void;

  /**
   * Returns the next item in the queue if there is one or null or undefined if there is nothing queued.
   *
   * @protected
   */
  protected abstract getNextInQueue(): QueuedRequest<any> | undefined | null;

  protected onLoadComplete(): void {
    this._loading = false;
    const nextParams = this.getNextInQueue();
    if(nextParams) {
      this.makeRequest(nextParams.observable, nextParams.successFunc, nextParams.errorFunc);
    }
  }
}

export class QueuedRequest<T> {
  constructor(public observable: Observable<T> | (() => Observable<T> | null),
              public successFunc?: (result: T) => void,
              public errorFunc?: (error: any) => void) {
  }
}
