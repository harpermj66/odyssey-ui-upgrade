import {CompanyVoModel} from "../../repair-job/model/company-vo.model";
import {CurrencyVoModel} from "../../repair-job/model/currency-vo.model";
import {DepotVoModel} from "../../repair-job/model/depot-vo.model";


export class ApprovalLimitsModel{

  id: number;
  company: CompanyVoModel;
  currency: CurrencyVoModel;
  depot: DepotVoModel;
  emailTo?: string[];
  emailFrom?: string;
  emailCc?: string[];
  emailBcc?: string[];
}
