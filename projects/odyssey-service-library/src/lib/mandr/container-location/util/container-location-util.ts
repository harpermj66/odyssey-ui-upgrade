import {ContainerLocationVoModel} from "../model/container-location-vo.model";
import {TerminalVoModel} from "../model/terminal-vo-model";
import {DepotVoModel} from "../model/depot-vo.model";

export class ContainerLocationUtil {
  public static areEqual(a?: ContainerLocationVoModel, b?: ContainerLocationVoModel): boolean {
    // Handle obj equal or both null
    if(a === b) {
      return true;
    }

    // Handle one null
    if((!a && b) || (a && !b)) {
      return false;
    }

    // neither should be null beyond here
    const aIsTerminal = !!(a as TerminalVoModel).terminalId;
    const bIsTerminal = !!(b as TerminalVoModel).terminalId;
    if(aIsTerminal && bIsTerminal) {
      return (a as TerminalVoModel).terminalId === (b as TerminalVoModel).terminalId;
    }

    const aIsDepot = !!(a as DepotVoModel).depotId;
    const bIsDepot = !!(b as DepotVoModel).depotId;
    if(aIsDepot && bIsDepot) {
      return (a as DepotVoModel).depotId === (b as DepotVoModel).depotId;
    }

    return false;
  }

  public static generateDisplayName(vo: ContainerLocationVoModel | {depotId: number} | {terminalId: number}): string {
    if(vo) {
      let name = (vo as ContainerLocationVoModel).nameShort;
      if((vo as ContainerLocationVoModel).unLocode && (vo as ContainerLocationVoModel).unLocode.locode) {
        name += ' [' + (vo as ContainerLocationVoModel).unLocode?.locode + ']';
      }
      return name;
    }
    return '';
  }
}
