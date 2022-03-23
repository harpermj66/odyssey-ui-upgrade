import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {RepairJobService} from "./repair-job.service";
import {RepairCommentModel} from "../model/repair-comment.model";
import {RepairCommentService} from "./repair-comment.service";
import {RepairJobVoModel} from "../model/repair-job-vo.model";

/**
 * Service for retrieving and editing Repair job comments from the Odyssey M&R microservice.
 */
@Injectable()
export class RepairJobCommentService implements RepairCommentService<RepairJobVoModel> {
  public static readonly PATH = 'mandr-service/api/repair-job-comment';

  constructor(private http: HttpClient) {
  }

  public getComments(pageable: PageableModel): Observable<PageModel<RepairCommentModel<RepairJobVoModel>>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairJobCommentService.PATH, {params}) as Observable<PageModel<RepairCommentModel<RepairJobVoModel>>>;
  }

  public getCommentsForEntity(jobId: number, pageable: PageableModel): Observable<PageModel<RepairCommentModel<RepairJobVoModel>>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairJobService.PATH + '/' + jobId + '/repair-item-comment',
      {params}) as Observable<PageModel<RepairCommentModel<RepairJobVoModel>>>;
  }

  public searchCommentsForEntity(jobId: number,
                                 pageable: PageableModel,
                                 filter?: string): Observable<PageModel<RepairCommentModel<RepairJobVoModel>>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter) {
      params = params.set('filter', filter);
    }
    return this.http.get(RepairJobService.PATH + '/' + jobId + '/repair-item-comment/search',
      {params}) as Observable<PageModel<RepairCommentModel<RepairJobVoModel>>>;
  }

  public getComment(id: number): Observable<RepairCommentModel<RepairJobVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.get(RepairJobCommentService.PATH + '/' + id, {params}) as Observable<RepairCommentModel<RepairJobVoModel>>;
  }

  public updateComment(id: number, comment: RepairCommentModel<RepairJobVoModel>): Observable<RepairCommentModel<RepairJobVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairJobCommentService.PATH + '/' + id, comment, {params}) as Observable<RepairCommentModel<RepairJobVoModel>>;
  }

  public deleteComment(id: number): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.delete(RepairJobCommentService.PATH + '/' + id, {params}) as Observable<any>;
  }

  public addCommentToEntity(jobId: number, repairItemComment: RepairCommentModel<RepairJobVoModel>): Observable<RepairCommentModel<RepairJobVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairJobService.PATH + '/' + jobId + '/repair-item-comment',
      repairItemComment, {params}) as Observable<RepairCommentModel<RepairJobVoModel>>;
  }
}
