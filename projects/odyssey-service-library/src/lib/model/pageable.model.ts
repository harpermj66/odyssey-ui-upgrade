import {SortModel} from "./sort.model";
import {HttpParams} from "@angular/common/http";

export class PageableModel {
  public static readonly PAGE_SIZE_MAX = 2147483647;

  pageSize: number;
  pageNumber: number;
  sort?: SortModel[];

  public static toHttpParams(pageable?: PageableModel): HttpParams {
    let params = new HttpParams();
    if(pageable) {
      if(pageable.pageNumber) {
        params = params.set('page', pageable.pageNumber.toString());
      }
      if(pageable.pageSize) {
        params = params.set('size', pageable.pageSize.toString());
      }
      if(pageable.sort) {
        pageable.sort.forEach(
          sort => {
            params = params.append('sort', SortModel.paramValue(sort));
          }
        );
      }
    }
    return params;
  }
}
