export class ElementUtils {
  public static getScrollPercentage(element: any): number {
    return (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
  }

  public static hasScrollBarVertical(element: any): boolean {
    let res = !!element.scrollTop;
    if (!res) {
      element.scrollTop = 1;
      res = !!element.scrollTop;
      element.scrollTop = 0;
    }
    return res;
  }

  public static hasScrollBarHorizontal(element: any): boolean {
    let res = !!element.scrollLeft;
    if (!res) {
      element.scrollLeft = 1;
      res = !!element.scrollLeft;
      element.scrollLeft = 0;
    }
    return res;
  }
}
