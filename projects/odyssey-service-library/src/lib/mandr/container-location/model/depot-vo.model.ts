import {ContainerLocationVoModel} from "./container-location-vo.model";

export class DepotVoModel implements ContainerLocationVoModel {
  depotId: number;
  name: string;
  nameShort: string;
  unLocode: {locode: string};
}
