import {DepotVoModel} from "../../container-location/model/depot-vo.model";
import {TerminalVoModel} from "../../container-location/model/terminal-vo-model";

export class ContainerEventVoModel {
  containerDepot?: DepotVoModel;
  terminal?: TerminalVoModel;
  eventType: string;
  eventDatetime: string;
  containerNumber: string;
  emptyContainer: boolean;
}
