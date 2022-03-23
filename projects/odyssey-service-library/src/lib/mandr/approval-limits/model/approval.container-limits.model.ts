import {CurrencyVoModel} from "../../shared/model/currency-vo.model";
import {ContApprovalLimitsVoModel} from "./cont-approval-limits-vo.model";
import {CompanyVoModel} from "../../repair-job/model/company-vo.model";
import {DepotVoModel} from "../../repair-job/model/depot-vo.model";
import {TerminalVoModel} from "../../repair-job/model/terminal-vo-model";

export class ApprovalContainerLimitsModel{
  id: number;
  currency: CurrencyVoModel;
  depot?: DepotVoModel;
  terminal?: TerminalVoModel;
  company: CompanyVoModel;
  contApprovalLimits: ContApprovalLimitsVoModel[];
}
