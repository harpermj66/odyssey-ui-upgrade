import {ContTypeVoModel} from "./cont-type-vo.model";
import {ContainerCharacteristicVoModel} from "./container-characteristic-vo.model";

export class ContainerStockVoModel {
  contStockId: number;
  containerNumber: string;
  model: string;
  contType: ContTypeVoModel;
  containerCharacteristics: ContainerCharacteristicVoModel;
}
