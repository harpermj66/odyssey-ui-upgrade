import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {RepairJobModel} from "../model/repair-job.model";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";

@Injectable()
export class RepairJobService {
  public static readonly PATH = 'mandr-service/api/repair-job';

  constructor(private http: HttpClient) {
  }

  public searchRepairJobs(pageable: PageableModel, filter?: string): Observable<PageModel<RepairJobModel>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter) {
      params = params.set('filter', filter);
    }
    return this.http.get(RepairJobService.PATH + '/search', {params}) as Observable<PageModel<RepairJobModel>>;
  }

  public getRepairJobs(pageable: PageableModel): Observable<PageModel<RepairJobModel>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairJobService.PATH, {params}) as Observable<PageModel<RepairJobModel>>;
  }

  public getRepairJob(id: number): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.get(RepairJobService.PATH + '/' + id, {params}) as Observable<RepairJobModel>;
  }

  public updateRepairJob(id: number, repairJob: RepairJobModel): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairJobService.PATH + '/' + id, repairJob, {params}) as Observable<RepairJobModel>;
  }

  public deleteRepairJob(id: number, ignoreValidationWarnings?: boolean): Observable<RepairJobModel> {
    let params: HttpParams = new HttpParams();
    if(ignoreValidationWarnings) {
      params = params.set('force', 'true');
    }
    return this.http.delete(RepairJobService.PATH + '/' + id, {params}) as Observable<RepairJobModel>;
  }

  public saveRepairJob(repairJob: RepairJobModel): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH, repairJob, {params}) as Observable<RepairJobModel>;
  }

  /**
   * Approves a repair job and sends the job information to the depot/terminal.
   *
   * @param id The ID of the job.
   */
  public approveRepairJob(id: number): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/approve', null,{params}) as Observable<RepairJobModel>;
  }

  /**
   * Saves then approves a repair job and sends the job information to the depot/terminal.
   *
   * @param id The ID of the job.
   * @param job The new version of the repair job to save.
   */
  public saveAndApproveRepairJob(id: number, job: RepairJobModel): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/save-approve', job, {params}) as Observable<RepairJobModel>;
  }

  /**
   * Submits a repair job for approval.
   *
   * @param id The ID of the job.
   */
  public submitRepairJob(id: number): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/submit', null,{params}) as Observable<RepairJobModel>;
  }

  /**
   * Saves then submits a repair job for approval.
   *
   * @param id The ID of the job.
   * @param job The new version of the repair job to save.
   */
  public saveAndSubmitRepairJob(id: number, job: RepairJobModel): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/save-submit', job, {params}) as Observable<RepairJobModel>;
  }

  /**
   * Sends the job information to the depot/terminal.
   *
   * @param id The ID of the job.
   */
  public sendRepairJob(id: number): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/send', null, {params}) as Observable<RepairJobModel>;
  }

  /**
   * Saves then sends the job information to the depot/terminal.
   *
   * @param id The ID of the job.
   * @param job The new version of the repair job to save.
   */
  public saveAndSendRepairJob(id: number, job: RepairJobModel): Observable<RepairJobModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(RepairJobService.PATH + '/' + id + '/save-send', job, {params}) as Observable<RepairJobModel>;
  }

  /**
   * Returns True if all repair items for the given job are approved.
   * Returns False if at least one item not approved, or no items found for the giuven job id.
   *
   * @param id The ID of the job to check items for.
   */
  public isAnyRepairItemApproved(id: number): Observable<boolean> {
    const params: HttpParams = new HttpParams();
    return this.http.get(RepairJobService.PATH + '/' + id + '/item-approved', {params}) as Observable<boolean>;
  }

}
