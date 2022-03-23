import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {RepairItemService} from "./repair-item.service";
import {RepairCommentModel} from "../model/repair-comment.model";
import {RepairCommentService} from "./repair-comment.service";
import {RepairItemVoModel} from "../model/repair-item-vo.model";

/**
 * Service for retrieving and editing Repair Item comments from the Odyssey M&R microservice.
 */
@Injectable()
export class RepairItemCommentService implements RepairCommentService<RepairItemVoModel> {
  public static readonly PATH = 'mandr-service/api/repair-item-comment';

  constructor(private http: HttpClient) {
  }

  public getComments(pageable: PageableModel): Observable<PageModel<RepairCommentModel<RepairItemVoModel>>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairItemCommentService.PATH, {params}) as Observable<PageModel<RepairCommentModel<RepairItemVoModel>>>;
  }

  public getCommentsForEntity(itemId: number, pageable: PageableModel): Observable<PageModel<RepairCommentModel<RepairItemVoModel>>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(RepairItemService.PATH + '/' + itemId + '/repair-item-comment',
      {params}) as Observable<PageModel<RepairCommentModel<RepairItemVoModel>>>;
  }

  public searchCommentsForEntity(itemId: number,
                                 pageable: PageableModel,
                                 filter?: string): Observable<PageModel<RepairCommentModel<RepairItemVoModel>>> {
    let params: HttpParams = PageableModel.toHttpParams(pageable);
    if(filter) {
      params = params.set('filter', filter);
    }
    return this.http.get(RepairItemService.PATH + '/' + itemId + '/repair-item-comment/search',
      {params}) as Observable<PageModel<RepairCommentModel<RepairItemVoModel>>>;
  }

  public getComment(id: number): Observable<RepairCommentModel<RepairItemVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.get(RepairItemCommentService.PATH + '/' + id, {params}) as Observable<RepairCommentModel<RepairItemVoModel>>;
  }

  public updateComment(id: number, comment: RepairCommentModel<RepairItemVoModel>): Observable<RepairCommentModel<RepairItemVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairItemCommentService.PATH + '/' + id, comment, {params}) as Observable<RepairCommentModel<RepairItemVoModel>>;
  }

  public deleteComment(id: number): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.delete(RepairItemCommentService.PATH + '/' + id, {params}) as Observable<any>;
  }

  public addCommentToEntity(itemId: number, repairItemComment: RepairCommentModel<RepairItemVoModel>): Observable<RepairCommentModel<RepairItemVoModel>> {
    const params: HttpParams = new HttpParams();
    return this.http.put(RepairItemService.PATH + '/' + itemId + '/repair-item-comment',
      repairItemComment, {params}) as Observable<RepairCommentModel<RepairItemVoModel>>;
  }
}
