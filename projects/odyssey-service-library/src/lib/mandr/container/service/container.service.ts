import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {ContainerStockVoModel} from "../model/container-stock-vo.model";

/**
 * Service for retrieving and editing Repair Items from the Odyssey M&R microservice.
 */
@Injectable()
export class ContainerService {
  public static readonly PATH = 'mandr-service/api/container-stock';

  constructor(private http: HttpClient) {
  }

  /**
   * Get a paged list of containers with container numbers matching the filter.
   *
   * @param pageable The page parameters.
   * @param filter The filter string to search for.
   */
  public searchContainers(pageable: PageableModel, filter?: string): Observable<PageModel<ContainerStockVoModel>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter && filter.trim().length > 0) {
      params = params.set('filter', filter.trim());
    }
    return this.http.get(ContainerService.PATH + '/search', {params}) as Observable<PageModel<ContainerStockVoModel>>;
  }
}
