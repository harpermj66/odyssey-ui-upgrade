import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AsyncCacheLoader} from "../../../utils/async-cache-loader";
import {map} from "rxjs/operators";

@Injectable()
export class ContainerCategoriesService {
  public static readonly PATH = 'vendorjobs-service/api/container-category';

  private cache = new AsyncCacheLoader<string[]>(this.loadAllCategories.bind(this), 600);

  constructor(private http: HttpClient) {
  }

  public getCategories(filter?: string): Observable<string[]> {
    return this.cache.get().pipe(
      map(
        types => {
          const filterLower = filter && filter.trim() !== '' ? filter.trim().toLowerCase() : null;
          if(filterLower) {
            return types.filter(type => type.toLowerCase().includes(filterLower));
          } else {
            return types;
          }
        }
      )
    );
  }

  private loadAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(ContainerCategoriesService.PATH);
  }
}
