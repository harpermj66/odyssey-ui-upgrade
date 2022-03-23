import {Injectable, OnDestroy} from "@angular/core";
import {Observable} from "rxjs";
import {AbstractRequestQueue, QueuedRequest} from "./abstract-request-queue";

/**
 * A simple request queue that allows for a single running request and queues all other requests in the order they are added.
 */
@Injectable()
export class RequestQueue extends AbstractRequestQueue implements OnDestroy {

  /**
   * Added a request to the queue.
   *
   * @param observableOrFunc The request to make, or a function that builds the request to make
   * just before the request is called.
   * @param successFunc The function to call on request success.
   * @param errorFunc The function to call on failure.
   * @protected
   */
  protected addToQueue<T>(observableOrFunc: Observable<T> | (() => Observable<T> | null),
                          successFunc?: (result: T) => void,
                          errorFunc?: (error: any) => void): void {
    this.queued.push(new QueuedRequest<T>(observableOrFunc, successFunc, errorFunc));
  }

  /**
   * Returns the next item in the queue if there is one or null or undefined if there is nothing queued.
   *
   * @protected
   */
  protected getNextInQueue(): QueuedRequest<any> | undefined | null {
    return this.queued.length > 0 ? this.queued.shift() : null;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
