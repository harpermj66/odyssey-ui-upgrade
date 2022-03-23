import {FindModel} from "../../api/find-model";
import {HttpParams} from "@angular/common/http";

/**
 * Helper class for FindModel functions.
 */
export class FindModelHelper {

  /**
   * Builds the query parameters for a find model.
   * @param findModel
   */
  public static buildHttpParams(findModel: FindModel): HttpParams {
    return new HttpParams()
      .set('search', findModel.search)
      .set('fields', findModel.fields)
      .set('sort', findModel.sort)
      .set('page', findModel.page.toString())
      .set('size', findModel.size.toString());
  }
}
