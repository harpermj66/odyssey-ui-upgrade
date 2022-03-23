import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
  selector: '[odysseyApplicationUI]'
})
export class PlacedholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
