import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {RepairJobService} from "./repair-job.service";
import {RepairItemModel} from "../model/repair-item.model";

/**
 * Service for retrieving and editing Repair Items from the Odyssey M&R microservice.
 */
@Injectable()
export class RepairItemService {
  public static readonly PATH = 'mandr-service/api/repair-item';

  constructor(private http: HttpClient) {
  }

  /**
   * Get a page list of repair items.
   *
   * @param pageable The page parameters.
   */
  public getRepairItems(pageable: PageableModel): Observable<PageModel<RepairItemModel>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairItemService.PATH, {params}) as Observable<PageModel<RepairItemModel>>;
  }

  /**
   * Get a paged list of repair items for the given repair job.
   *
   * @param jobId The ID of the repair job.
   * @param pageable The page parameters.
   */
  public getRepairItemsForRepairJob(jobId: number, pageable: PageableModel): Observable<PageModel<RepairItemModel>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(this.getRepairJobToItemsRoute(jobId), {params}) as Observable<PageModel<RepairItemModel>>;
  }

  /**
   * Get a repair item by ID.
   *
   * @param id The repair item ID.
   */
  public getRepairItem(id: number): Observable<RepairItemModel> {
    const params: HttpParams = new HttpParams();
    return this.http.get(RepairItemService.PATH + '/' + id, {params}) as Observable<RepairItemModel>;
  }

  /**
   * Update a repair item by ID.
   *
   * @param id The ID of the repair item.
   * @param item The new repair item properties.
   */
  public updateRepairItem(id: number, item: RepairItemModel): Observable<RepairItemModel> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairItemService.PATH + '/' + id, item, {params}) as Observable<RepairItemModel>;
  }

  /**
   * Delete a repair item by ID.
   * @param id The ID of the repair item.
   * @param ignoreValidationWarnings Whether warning-level validation issues should be ignored (eg. cascade warnings).
   */
  public deleteRepairItem(id: number, ignoreValidationWarnings?: boolean): Observable<any> {
    let params: HttpParams = new HttpParams();
    if(ignoreValidationWarnings) {
      params = params.set('force', 'true');
    }
    return this.http.delete(RepairItemService.PATH + '/' + id, {params}) as Observable<any>;
  }

  /**
   * Add a new repair item to a repair job.
   * @param jobId The ID of the repair job.
   * @param repairItem The new repair item properties.
   */
  public addRepairItemToRepairJob(jobId: number, repairItem: RepairItemModel): Observable<RepairItemModel> {
    const params: HttpParams = new HttpParams();
    return this.http.put(this.getRepairJobToItemsRoute(jobId), repairItem, {params}) as Observable<RepairItemModel>;
  }

  public approveAllForRepairJob(jobId: number): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.post(this.getRepairJobToItemsRoute(jobId) + '/approve-all', null, {params}) as Observable<RepairItemModel>;
  }

  private getRepairJobToItemsRoute(jobId: number): string {
    return RepairJobService.PATH + '/' + jobId + '/repair-item';
  }
}
