import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PageableModel} from "../../../model/pageable.model";
import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {ContApprovalLimitsModel} from "../model/cont-approval-limits.model";


@Injectable()
export class ContainerApprovalLimitsService {


  public static readonly PATH = 'mandr-service/api/container-approval-limits';

  constructor(private http: HttpClient) {
  }

  public getContainerApprovalLists(pageable: PageableModel): Observable<PageModel<ContApprovalLimitsModel>> {
    const params: HttpParams = PageableModel.toHttpParams(pageable);
    return this.http.get(ContainerApprovalLimitsService.PATH, {params}) as Observable<PageModel<ContApprovalLimitsModel>>;
  }

  public getContainerApprovalList(id: number): Observable<ContApprovalLimitsModel> {
    const params: HttpParams = new HttpParams();
    return this.http.get(ContainerApprovalLimitsService.PATH + '/' + id, {params}) as Observable<ContApprovalLimitsModel>;
  }
}
