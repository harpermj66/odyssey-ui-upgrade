import {CompanyVoModel} from "./company-vo.model";
import {UserVoModel} from "./user-vo.model";

export class RepairCommentModel<T> {
  id: number;
  type: string;
  comment: string;
  created: string;
  company: CompanyVoModel;
  user?: UserVoModel;
  containingEntity: T;
}
