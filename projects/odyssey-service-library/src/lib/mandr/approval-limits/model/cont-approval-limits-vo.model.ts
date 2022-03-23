import {ContTypeGroupVoModel} from "./cont-type-group-vo.model";
import {CompanyVoModel} from "../../repair-job/model/company-vo.model";

export class ContApprovalLimitsVoModel{
  id: number;
  contTypeGroup: ContTypeGroupVoModel;
  maxLimit: number;
  company: CompanyVoModel;
}
