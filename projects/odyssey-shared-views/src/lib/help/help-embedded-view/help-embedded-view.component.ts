import {Component, OnInit} from '@angular/core';
import {
  IRightViewComponent,
  RightViewEventType,
  SlideOutRightViewSubscriberService
} from "../../../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'lib-help-embedded-view',
  templateUrl: './help-embedded-view.component.html',
  styleUrls: ['./help-embedded-view.component.css']
})
export class HelpEmbeddedViewComponent implements OnInit, IRightViewComponent {

  constructor(
    public slideOutRightViewSubscriberService: SlideOutRightViewSubscriberService
  ) {
  }

  type: string;
  videoSrc: SafeResourceUrl;

  setArguments(args: any): void {
    this.type = (args as string[])[0][0] as string;
    this.videoSrc = (args as string[])[0][1] as string;
  }

  ngOnInit(): void {
    // set iframe src to empty string when right view is closed.
    this.slideOutRightViewSubscriberService.showRightViewSubscriber.subscribe((rightViewEvent) => {
      if (rightViewEvent.type === RightViewEventType.Close) {
        this.videoSrc = '';
      }
    });
  }

}
