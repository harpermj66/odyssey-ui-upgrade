import {PageableModel} from "../model/pageable.model";
import {Observable} from "rxjs";
import {DiscardingRequestQueue} from "./discarding-request-queue";
import {PageModel} from "../model/page.model";
import {ElementUtils} from "./element-utils";
import {SortModel} from "../model/sort.model";

export class InfiniteScroll<T> {
  private static readonly THRESHOLD_DEFAULT = 95;

  private requestQueue = new DiscardingRequestQueue();
  private pageSettings = new PageableModel();
  private lastPage = false;
  private thresholdPercent?: number;

  constructor(private loader: (pageable: PageableModel) => Observable<PageModel<T>>,
              private successFunc?: (val: PageModel<T>) => void,
              private errorFunc?: (error: any) => void,
              private nativeElement?: any,
              private pageStart = 0) {
    if (nativeElement) {
      this.setElement(nativeElement);
    }
  }

  public get loading(): boolean {
    return this.requestQueue.loading;
  }

  public get element(): any {
    return this.nativeElement;
  }

  public setThresholdPercent(threshold: number): InfiniteScroll<T> {
    if(!threshold || threshold <= 0 || threshold >= 100) {
      // Fall back to default
      delete this.thresholdPercent;
    } else {
      this.thresholdPercent = threshold;
    }
    return this;
  }

  public setPageSize(size: number): InfiniteScroll<T> {
    this.pageSettings.pageSize = size;
    return this;
  }

  public setPageNumber(index: number): InfiniteScroll<T> {
    this.pageSettings.pageNumber = index;
    return this;
  }

  public setSort(sort: SortModel[]): InfiniteScroll<T> {
    this.pageSettings.sort = sort;
    return this;
  }

  public setLoader(loader: (pageable: PageableModel) => Observable<PageModel<T>>): InfiniteScroll<T> {
    this.loader = loader;
    return this;
  }

  public setElement(element: any): InfiniteScroll<T> {
    this.nativeElement = element;

    if (element) {
      element.addEventListener('scroll', () => {
        if (ElementUtils.getScrollPercentage(element) >
          (this.thresholdPercent ? this.thresholdPercent : InfiniteScroll.THRESHOLD_DEFAULT)) {
          this.nextPage();
        }
      });

      // Keep loading for the infinite scroll as we do not have enough loaded to have a scroll bar
      if (!ElementUtils.hasScrollBarVertical(element)) {
        this.nextPage();
      }
    }
    return this;
  }

  public firstPage(): void {
    this.pageSettings.pageNumber = this.pageStart - 1;
    this.lastPage = false;
    this.nextPage();
  }

  /**
   * Load the next page.
   *
   * @param force Ignore any last page flag and attempt to get the next page anyway.
   */
  public nextPage(force?: boolean): void {
    this.requestQueue.makeRequest(
      () => {
        if(this.lastPage && !force) {
          return null;
        } else {
          this.pageSettings.pageNumber = this.pageSettings.pageNumber ? this.pageSettings.pageNumber + 1 : 1;
        }
        return this.loader(this.pageSettings);
      },
      results => this.onPageLoadComplete(results),
      this.errorFunc
    );
  }

  /**
   * Reload the current page.
   */
  public refresh(): void {
    this.requestQueue.makeRequest(
      () => {
        return this.loader(this.pageSettings);
      },
      results => {
        this.onPageLoadComplete(results);
      },
      this.errorFunc
    );
  }

  /**
   * Load the previous page if one exists.
   */
  public previousPage(): void {
    this.requestQueue.makeRequest(
      () => {
        if (this.pageSettings.pageNumber === this.pageStart) {
          return null;
        } else {
          this.pageSettings.pageNumber = this.pageSettings.pageNumber ? this.pageSettings.pageNumber - 1 : 0;
        }
        return this.loader(this.pageSettings);
      },
      results => this.onPageLoadComplete(results),
      this.errorFunc
    );
  }

  public hasScrollBar(): boolean {
    return this.nativeElement && ElementUtils.hasScrollBarVertical(this.nativeElement);
  }

  public destroy(): void {
    this.requestQueue.destroy();
  }

  private onPageLoadComplete(results: PageModel<T>): void {
    if (this.pageSettings.pageNumber && (results.totalPages - 1) <= this.pageSettings.pageNumber) {
      this.lastPage = true;
    } else {
      this.lastPage = false;
    }

    if (this.successFunc) {
      this.successFunc(results);
    }
  }
}
