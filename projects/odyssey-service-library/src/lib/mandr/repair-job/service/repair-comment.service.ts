import {Observable} from "rxjs";
import {PageModel} from "../../../model/page.model";
import {PageableModel} from "../../../model/pageable.model";
import {RepairCommentModel} from "../model/repair-comment.model";

export interface RepairCommentService<T> {

  getComments(pageable: PageableModel): Observable<PageModel<RepairCommentModel<T>>>;

  getCommentsForEntity(itemId: number, pageable: PageableModel): Observable<PageModel<RepairCommentModel<T>>>;

  searchCommentsForEntity(itemId: number,
                          pageable: PageableModel,
                          filter?: string): Observable<PageModel<RepairCommentModel<T>>>;

  getComment(id: number): Observable<RepairCommentModel<T>>;

  updateComment(id: number, comment: RepairCommentModel<T>): Observable<RepairCommentModel<T>>;

  deleteComment(id: number): Observable<any>;

  addCommentToEntity(itemId: number, repairItemComment: RepairCommentModel<T>): Observable<RepairCommentModel<T>>;
}
