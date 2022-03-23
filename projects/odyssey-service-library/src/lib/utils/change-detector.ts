import {ChangeDetectorRef, ViewRef} from "@angular/core";

export class ChangeDetector {
  public static detectChanges(changeDetector: ChangeDetectorRef): void {
    if(changeDetector && !(changeDetector as ViewRef).destroyed) {
      changeDetector.detectChanges();
    }
  }

  public static destroy(changeDetector: ChangeDetectorRef): void {
    if(changeDetector) {
      changeDetector.detach();
    }
  }
}
