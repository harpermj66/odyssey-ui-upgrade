import {Injectable} from '@angular/core';
import {HelpMenuItem, helpMenuModel} from "./help.model";
import {
  RightViewEvent,
  RightViewEventType,
  SlideOutRightViewSubscriberService
} from "../../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";

export type HelpItemSelectedEvent = Pick<HelpMenuItem, 'title' | 'type' | 'resource'>;

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(
    private slideOutRightViewSubscriberService: SlideOutRightViewSubscriberService
  ) {
  }

  getModelForRoot(rootTitle: string): HelpMenuItem {
    return helpMenuModel;
    // this method could be changed to control which subset of the help menu gets shown
  }

  handleHelpItemSelect(selected: HelpItemSelectedEvent): void {
    switch (selected.type) {
      case "video":
        this.openSlideOutRightView(selected);
        break;
      case "text":
        this.openLinkInNewTab(selected);
        break;
    }
  }

  openSlideOutRightView(selected: HelpItemSelectedEvent): void {
    this.slideOutRightViewSubscriberService.openView(new RightViewEvent(RightViewEventType.Open, selected.title, "HelpEmbeddedView",
      [selected.type, selected.resource]));
  }

  openLinkInNewTab(selected: HelpItemSelectedEvent): void {
    window.open(selected.resource);
  }
}

