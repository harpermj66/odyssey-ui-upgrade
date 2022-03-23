import {FindModel} from "../api/find-model";
import {Observable} from "rxjs";
import {SavedSearchModel} from "./rule/model/saved-search.model";

/**
 * Interface that saved search supporting remote services should implement.
 */
export interface SavedSearchProvider<T> {
  findBySearchId(id: string, findModel: FindModel): Observable<T>;
  findBySearchObject(savedSearch: SavedSearchModel, findModel: FindModel): Observable<T>;
}
