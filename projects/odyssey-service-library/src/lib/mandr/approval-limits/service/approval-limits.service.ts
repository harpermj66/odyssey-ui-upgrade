import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PageableModel} from "../../../model/pageable.model";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {ApprovalLimitsModel} from "../model/approval-limits.model";
import {ApprovalsModel} from "../model/approvals.model";
import {ApprovalContainerLimitsModel} from "../model/approval.container-limits.model";

@Injectable()
export class ApprovalLimitsService{

  public static readonly PATH = 'mandr-service/api/approval-limits';

  constructor(private http: HttpClient) {
  }

  public getApprovalLists(pageable: PageableModel): Observable<PageModel<ApprovalLimitsModel>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(ApprovalLimitsService.PATH, {params}) as Observable<PageModel<ApprovalLimitsModel>>;
  }

  public getApprovalList(id: number): Observable<ApprovalLimitsModel> {
    const params: HttpParams = new HttpParams();
    return this.http.get(ApprovalLimitsService.PATH + '/' + id, {params}) as Observable<ApprovalLimitsModel>;
  }

  public updateApprovalLimits(id: number,approvalLimitsModel: ApprovalLimitsModel): Observable<ApprovalLimitsModel>{
    const params: HttpParams = new HttpParams();
    return this.http.put(ApprovalLimitsService.PATH +'/'+id,approvalLimitsModel,{params}) as Observable<ApprovalLimitsModel>;
  }

  public getApprovals(pageable: PageableModel): Observable<PageModel<ApprovalsModel>>{

    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(ApprovalLimitsService.PATH +'/'+'approval',{params}) as Observable<PageModel<ApprovalsModel>>;
  }

  public getApproval(id: number): Observable<ApprovalsModel>{

    const params: HttpParams = new HttpParams();
    return this.http.get(ApprovalLimitsService.PATH +'/'+'approval'+'/' +id,{params}) as Observable<ApprovalsModel>;
  }

  public updateApproval(id: number, approvals: ApprovalsModel): Observable<ApprovalsModel> {
    const params: HttpParams = new HttpParams();
    return this.http.put(ApprovalLimitsService.PATH + '/' +'approval'+'/'+ id,
      approvals, {params}) as Observable<ApprovalsModel>;
  }

  public createOrUpdateApproval(approvals: ApprovalsModel): Observable<ApprovalsModel> {
    const params: HttpParams = new HttpParams();
    return this.http.post(ApprovalLimitsService.PATH + '/approval',
      approvals, {params}) as Observable<ApprovalsModel>;
  }

  public deleteApprovals(id: number): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.delete(ApprovalLimitsService.PATH + '/approval/'+ id, {params}) as Observable<any>;
  }
}
