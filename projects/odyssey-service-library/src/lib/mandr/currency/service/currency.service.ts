import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CurrencyVoModel} from "../../shared/model/currency-vo.model";
import {AsyncCacheLoader} from "../../../utils/async-cache-loader";
import {map} from "rxjs/operators";
import {PageableModel} from "../../../model/pageable.model";
import {PageModel} from "../../../model/page.model";


@Injectable()
export class CurrencyService{
  public static readonly PATH = 'mandr-service/api/currency';

  private currencyListCache: AsyncCacheLoader<CurrencyVoModel[]> = new AsyncCacheLoader<CurrencyVoModel[]>(
    () => this.loadAllCurrencies(),
    600);

  constructor(private http: HttpClient) {

  }

  private loadAllCurrencies(): Observable<CurrencyVoModel[]> {
    const page = new PageableModel();
    page.pageSize = PageableModel.PAGE_SIZE_MAX;
    const params: HttpParams = PageableModel.toHttpParams(page);
    return (this.http.get(CurrencyService.PATH +'/search', {params}) as Observable<PageModel<CurrencyVoModel>>)
      .pipe(
        map(results => {
          return results.content ? results.content : [];
        })
      );
  }

  public searchCurrencies(filter?: string): Observable<CurrencyVoModel[]> {
    if(filter && filter.trim().length !== 0) {
      const filterLower = filter.trim().toLowerCase();
      return this.currencyListCache.get().pipe(
        map(
          currencies => currencies.filter( a => a.shortname && a.shortname.toLowerCase().startsWith(filterLower))
        )
      );
    } else {
      return this.currencyListCache.get();
    }
  }

}
