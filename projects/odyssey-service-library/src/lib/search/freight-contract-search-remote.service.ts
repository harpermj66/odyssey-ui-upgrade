import {HttpClient} from "@angular/common/http";
import {FindModel} from "../api/find-model";
import {Injectable} from "@angular/core";

@Injectable()
export class FreightContractSearchRemoteService {

  constructor(private httpClient: HttpClient) {}

  findServicContracts(findModel: FindModel) {
    const url = 'search-service/api/servicecontract/search?search=' + findModel.search + '&fields=' + findModel.fields +
      '&sort=' + findModel.sort + '&page=' + findModel.page + '&size=' + findModel.size;
    return this.httpClient.get(url);
  }

}
