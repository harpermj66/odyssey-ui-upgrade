import {Component, ComponentRef, Input, OnInit, ViewChild} from '@angular/core';
import {IRightViewComponent, RightViewEvent} from "./slide-out-right-view-subscriber.service";
import {ApplicationComponentResolverService} from "../application-component-resolver.service";
import {PlacedholderDirective} from "../PlacedholderDirective";

@Component({
  selector: 'app-slide-out-right-view',
  templateUrl: './slide-out-right-view.component.html',
  styleUrls: ['./slide-out-right-view.component.scss']
})
export class SlideOutRightViewComponent implements OnInit {


  @ViewChild(PlacedholderDirective,{static: false}) dynamicContent: PlacedholderDirective;

  _rightViewEvent: RightViewEvent;
  componentRef: ComponentRef<any>;
  _appTitle = '';

  constructor(public applicationComponentResolverService: ApplicationComponentResolverService) { }

  ngOnInit(): void {
  }

  @Input()
  set appTitle(value: string) {
    this._appTitle = value;
  }

  get appTitle(): string {
    return this._appTitle;
  }

  @Input()
  set rightViewEvent(value: RightViewEvent) {
    this._rightViewEvent = value;
    if (value != null) {
      this.loadView();
    }
  }

  get rightViewEvent(): RightViewEvent {
    return this._rightViewEvent;
  }

  loadView(): void {
    const applicationContainerRef = this.dynamicContent.viewContainerRef;
    applicationContainerRef.clear();
    const factory = this.applicationComponentResolverService.getComponentFactory(this.rightViewEvent.viewId);
    if (factory) {
      this.componentRef = applicationContainerRef.createComponent<IRightViewComponent>(factory);
      this.componentRef.instance.setArguments(this.rightViewEvent.arguments);
    }
  }


}
