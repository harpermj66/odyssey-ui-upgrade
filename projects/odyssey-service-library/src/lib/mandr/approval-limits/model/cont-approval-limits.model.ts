import {CompanyVoModel} from "../../repair-job/model/company-vo.model";
import {ApprovalLimitsVoModel} from "./approval-limits-vo.model";

export class ContApprovalLimitsModel {

  id: number;
  company: CompanyVoModel;
  approvalLimits: ApprovalLimitsVoModel;
  maxLimit?: number;


}
