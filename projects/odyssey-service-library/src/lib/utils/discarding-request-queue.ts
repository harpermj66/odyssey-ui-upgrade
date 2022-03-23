import {Injectable, OnDestroy} from "@angular/core";
import {Observable} from "rxjs";
import {AbstractRequestQueue, QueuedRequest} from "./abstract-request-queue";

/**
 * A simple request queue that allows for a single running request and one queued request.
 * Only the most recent queued request with will be called all others will be discarded.
 */
@Injectable()
export class DiscardingRequestQueue extends AbstractRequestQueue implements OnDestroy {
  protected queuedRequest?: QueuedRequest<any>;


  protected addToQueue<T>(observableOrFunc: Observable<T> | (() => (Observable<T> | null)),
                          successFunc?: (result: T) => void,
                          errorFunc?: (error: any) => void): void {
    this.queuedRequest = new QueuedRequest<T>(observableOrFunc, successFunc, errorFunc);
  }

  protected getNextInQueue(): QueuedRequest<any> | undefined | null {
    let req: QueuedRequest<any> | null = null;
    if(this.queuedRequest) {
      req = this.queuedRequest;
      delete this.queuedRequest;
    }
    return req;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
