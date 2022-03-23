import {TerminalVoModel} from "./terminal-vo-model";
import {DepotVoModel} from "./depot-vo.model";
import {CompanyVoModel} from "./company-vo.model";
import {CurrencyVoModel} from "./currency-vo.model";
import {ContainerStockVoModel} from "./container-stock-vo.model";
import {UserVoModel} from "./user-vo.model";

export class RepairJobModel {
  public static readonly STATUS_SUBMITTED = 'SUBMITTED';
  public static readonly STATUS_APPROVED = 'APPROVED';
  public static readonly REPAIR_TYPE_SERVICE = 'SERVICE';
  public static readonly REPAIR_TYPE_OFF_HIRE = 'OFF_HIRE';

  public static readonly REPAIR_TYPES = [RepairJobModel.REPAIR_TYPE_SERVICE, RepairJobModel.REPAIR_TYPE_OFF_HIRE];

  id: number;
  jobNum: string;
  status: string;
  repairType: string;
  estimateCost?: number;
  approvedCost?: number;
  dueDate?: string;
  turnInDate?: string;
  estimateDate?: string;
  approvalDate?: string;
  completedDate?: string;
  company: CompanyVoModel;
  containerStock: ContainerStockVoModel;
  emergencyRepair: boolean;
  containerEmpty: boolean;
  currency: CurrencyVoModel;
  depot?: DepotVoModel;
  terminal?: TerminalVoModel;
  supplier?: DepotVoModel;
  locationName?: string;
  approver?: UserVoModel;
}
