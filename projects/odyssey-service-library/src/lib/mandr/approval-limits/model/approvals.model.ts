import {CurrencyVoModel} from "../../shared/model/currency-vo.model";
import {DepotVoModel} from "../../repair-job/model/depot-vo.model";
import {CompanyVoModel} from "../../repair-job/model/company-vo.model";

export class ApprovalsModel{
  id: number;
  currency: CurrencyVoModel;
  depot?: DepotVoModel;
  company: CompanyVoModel;
  emailTo?: string[];
  emailFrom?: string;
  emailCc?: string[];
  emailBcc?: string[];
  contApprovalLimits: {
    [contTypeGroupName: string]: number
  } = {};
}
