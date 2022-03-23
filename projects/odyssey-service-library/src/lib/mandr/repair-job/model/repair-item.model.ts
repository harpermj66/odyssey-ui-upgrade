import {CompanyVoModel} from "./company-vo.model";
import {RepairJobVoModel} from "./repair-job-vo.model";

export class RepairItemModel {
  id: number;
  status: string;
  componentCode?: string | null;
  locationCode?: string | null;
  damageCode?: string | null;
  repairCode?: string | null;
  damageHeight?: number;
  damageWidth?: number;
  hours?: number;
  labourRate?: number;
  totalLabourCost?: number;
  perUnitMaterialCost?: number;
  materialQuantity?: number;
  totalMaterialCost?: number;
  totalCost?: number;
  machinery: boolean;
  created: string;
  company: CompanyVoModel;
  repairJob: RepairJobVoModel;
}
