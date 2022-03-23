import {ContainerLocationVoModel} from "./container-location-vo.model";

export class TerminalVoModel implements ContainerLocationVoModel {
  terminalId: number;
  name: string;
  nameShort: string;
  unLocode: {locode: string};
}
