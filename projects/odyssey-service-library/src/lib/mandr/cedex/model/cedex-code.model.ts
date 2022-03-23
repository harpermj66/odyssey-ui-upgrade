import {ContTypeVoModel} from "../../container/model/cont-type-vo.model";

export class CedexCodeModel {
  public static readonly TYPE_REPAIR = 'repair';
  public static readonly TYPE_REPAIR_REEFER = 'repair_reefer';
  public static readonly TYPE_COMPONENT = 'component';
  public static readonly TYPE_COMPONENT_REEFER = 'component_reefer';
  public static readonly TYPE_COMPONENT_REEFER_MACHINERY = 'component_reefer_machinery';
  public static readonly TYPE_DAMAGE = 'damage';
  public static readonly TYPE_DAMAGE_REEFER = 'damage_reefer';
  public static readonly TYPE_RESPONSIBILITY = 'responsibility';
  public static readonly TYPE_MATERIAL = 'material';
  public static readonly TYPE_LOCATION = 'location';
  public static readonly TYPE_LOCATION_REEFER = 'location_reefer';
  public static readonly TYPE_LOCATION_SECONDCHAR = 'location_secondchar';
  public static readonly TYPE_LOCATION_SECONDCHAR_REEFER = 'location_secondchar_reefer';
  public static readonly TYPE_LOCATION_SECONDCHAR_REEFER_MACHINERY = 'location_secondchar_reefer_machinery';
  public static readonly TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_10_TO_20_FOOT = 'location_thirdfourthchar_reefer_10_20';
  public static readonly TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_30_TO_40_FOOT = 'location_thirdfourthchar_reefer_30_40';


  public static readonly TYPES = [
    CedexCodeModel.TYPE_REPAIR,
    CedexCodeModel.TYPE_COMPONENT,
    CedexCodeModel.TYPE_DAMAGE,
    CedexCodeModel.TYPE_RESPONSIBILITY,
    CedexCodeModel.TYPE_MATERIAL,
    CedexCodeModel.TYPE_LOCATION,
    CedexCodeModel.TYPE_LOCATION_SECONDCHAR,
    CedexCodeModel.TYPE_REPAIR_REEFER,
    CedexCodeModel.TYPE_COMPONENT_REEFER,
    CedexCodeModel.TYPE_COMPONENT_REEFER_MACHINERY,
    CedexCodeModel.TYPE_DAMAGE_REEFER,
    CedexCodeModel.TYPE_LOCATION_REEFER,
    CedexCodeModel.TYPE_LOCATION_SECONDCHAR_REEFER,
    CedexCodeModel.TYPE_LOCATION_SECONDCHAR_REEFER_MACHINERY,
    CedexCodeModel.TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_10_TO_20_FOOT,
    CedexCodeModel.TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_30_TO_40_FOOT,
  ];

  id: string;
  code: string;
  description: string;
  type: string;

  public static getLocation1CodeType(contType?: ContTypeVoModel | null): string {
    let type = '';
    if (contType && contType.reefer) {
      type = CedexCodeModel.TYPE_LOCATION_REEFER;
    } else {
      type = CedexCodeModel.TYPE_LOCATION;
    }
    return type;
  }

  public static getLocation2CodeType(contType?: ContTypeVoModel | null, machinery?: boolean | null): string {
    let type = '';
    if (contType && contType.reefer) {
      type = machinery ? CedexCodeModel.TYPE_LOCATION_SECONDCHAR_REEFER_MACHINERY : CedexCodeModel.TYPE_LOCATION_SECONDCHAR_REEFER;
    } else {
      type = CedexCodeModel.TYPE_LOCATION_SECONDCHAR;
    }
    return type;
  }

  public static getLocation3CodeType(contType?: ContTypeVoModel | null): string {
    let type = '';
    if (contType) {
      type = CedexCodeModel.TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_10_TO_20_FOOT;
    }
    return type;
  }

  public static getLocation4CodeType(contType?: ContTypeVoModel | null): string {
    let type = '';
    if (contType) {
      type = contType.contSize >= 30 ?
        CedexCodeModel.TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_30_TO_40_FOOT
        : CedexCodeModel.TYPE_LOCATION_THIRDFOURTHCHAR_REEFER_10_TO_20_FOOT;
    }
    return type;
  }

  public static getComponentCodeType(contType?: ContTypeVoModel | null, machinery?: boolean | null): string {
    let type = '';
    if (contType && contType.reefer) {
      if (machinery) {
        type = CedexCodeModel.TYPE_COMPONENT_REEFER_MACHINERY;
      } else {
        type = CedexCodeModel.TYPE_COMPONENT_REEFER;
      }
    } else {
      type = CedexCodeModel.TYPE_COMPONENT;
    }
    return type;
  }

  public static getDamageCodeType(contType?: ContTypeVoModel | null): string {
    let type = '';
    if (contType && contType.reefer) {
      type = CedexCodeModel.TYPE_DAMAGE_REEFER;
    } else {
      type = CedexCodeModel.TYPE_DAMAGE;
    }
    return type;
  }

  public static getRepairCodeType(contType?: ContTypeVoModel | null): string {
    let type = '';
    if (contType && contType.reefer) {
      type = CedexCodeModel.TYPE_REPAIR_REEFER;
    } else {
      type = CedexCodeModel.TYPE_REPAIR;
    }
    return type;
  }
}
