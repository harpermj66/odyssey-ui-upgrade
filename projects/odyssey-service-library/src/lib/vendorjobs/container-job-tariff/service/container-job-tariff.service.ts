import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PageableModel} from "../../../model/pageable.model";
import {Observable} from "rxjs";
import {ContainerJobTariffModel} from "../model/container-job-tariff.model";
import {PageModel} from "../../../model/page.model";

@Injectable()
export class ContainerJobTariffService {

  public static readonly PATH = 'vendorjobs-service/api/container-job-tariff';

  constructor(private http: HttpClient) {
  }

  public getTariffs(page?: PageableModel, filter?: string, labourRate?: boolean): Observable<PageModel<ContainerJobTariffModel>> {
    let params = PageableModel.toHttpParams(page);
    if(filter && filter.trim() !== '') {
      params = params.set('filter', filter.trim());
    }

    if(labourRate !== null && labourRate !== undefined) {
      params = params.set('labourRate', labourRate.toString());
    }

    return this.http.get<PageModel<ContainerJobTariffModel>>(ContainerJobTariffService.PATH, {params});
  }

  public getTariff(id: string): Observable<ContainerJobTariffModel> {
    return this.http.get<ContainerJobTariffModel>(ContainerJobTariffService.PATH + '/' + id);
  }

  public createOrUpdateTariff(tariff: ContainerJobTariffModel): Observable<ContainerJobTariffModel> {
    return this.http.post<ContainerJobTariffModel>(ContainerJobTariffService.PATH, tariff);
  }

  public updateTariff(id: string, tariff: ContainerJobTariffModel): Observable<ContainerJobTariffModel> {
    tariff.id = id;
    return this.http.put<ContainerJobTariffModel>(ContainerJobTariffService.PATH + '/' + id, tariff);
  }

  public deleteTariff(id: string): Observable<void> {
    return this.http.delete<void>(ContainerJobTariffService.PATH + '/' + id);
  }

}
