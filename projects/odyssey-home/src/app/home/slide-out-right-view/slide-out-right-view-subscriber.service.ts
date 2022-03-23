import {Subject} from "rxjs";
import {Injectable, OnDestroy} from "@angular/core";

export enum RightViewEventType {
  Open = 1,
  PrepareView = 2,
  Close = 3
}
export class RightViewEvent {
  arguments: any;
  constructor(public type: RightViewEventType, public viewTitle: string, public viewId: string, ...args: any[] ) {
    this.arguments = args;
  }
}

export interface IRightViewComponent {
  setArguments(args: any): void;
}


@Injectable()
export class SlideOutRightViewSubscriberService implements OnDestroy {

  showRightViewSubscriber = new Subject<RightViewEvent>();

  openView(rightViewEvent: RightViewEvent): void {
    this.showRightViewSubscriber.next(rightViewEvent);
  }

  ngOnDestroy(): void {
    if (this.showRightViewSubscriber != null) {
      this.showRightViewSubscriber.unsubscribe();
    }
  }

}
