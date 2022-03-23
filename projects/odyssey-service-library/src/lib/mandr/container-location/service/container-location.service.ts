import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {ContainerLocationVoModel} from "../model/container-location-vo.model";
import {DepotVoModel} from "../model/depot-vo.model";
import {TerminalVoModel} from "../model/terminal-vo-model";

@Injectable()
export class ContainerLocationService {
  public static readonly PATH = 'mandr-service/api/container-location';

  constructor(private http: HttpClient) {
  }

  /**
   * Get a paged list of container locations with names or locodes matching the filter.
   *
   * @param pageable The page parameters.
   * @param filter The filter string to search for.
   */
  public searchContainerLocations(pageable: PageableModel, filter?: string): Observable<PageModel<ContainerLocationVoModel>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter && filter.trim().length > 0) {
      params = params.set('filter', filter.trim());
    }
    return this.http.get(ContainerLocationService.PATH + '/search', {params}) as Observable<PageModel<ContainerLocationVoModel>>;
  }

  /**
   * Get a paged list of depots with names or locodes matching the filter.er.
   *
   * @param pageable The page parameters.
   * @param filter The filter string to search for.
   */
  public searchDepots(pageable: PageableModel, filter?: string): Observable<PageModel<DepotVoModel>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter && filter.trim().length > 0) {
      params = params.set('filter', filter.trim());
    }
    return this.http.get(ContainerLocationService.PATH + '/depot/search', {params}) as Observable<PageModel<DepotVoModel>>;
  }

  /**
   * Get a paged list of terminals with names or locodes matching the filter.er.
   *
   * @param pageable The page parameters.
   * @param filter The filter string to search for.
   */
  public searchTerminals(pageable: PageableModel, filter?: string): Observable<PageModel<TerminalVoModel>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter && filter.trim().length > 0) {
      params = params.set('filter', filter.trim());
    }
    return this.http.get(ContainerLocationService.PATH + '/terminal/search', {params}) as Observable<PageModel<TerminalVoModel>>;
  }

  /**
   * Get the last container location a container was turned in to.
   *
   * @param containerNumber The filter string to search for.
   */
  public getLastTurnInLocation(containerNumber: string): Observable<ContainerLocationVoModel> {
    return this.http.get(ContainerLocationService.PATH + '/for-container/' + containerNumber) as Observable<ContainerLocationVoModel>;
  }
}
