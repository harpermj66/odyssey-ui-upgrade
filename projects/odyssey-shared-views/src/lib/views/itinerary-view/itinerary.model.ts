export class ItineraryLeg {

    [key: string]: any;

    bookingId: bigint;
    bookingItineraryId: bigint;
    itineraryType = '';
    itineraryIndex?: number;
    legIndex?: number;
    tradeRoute = '';
    vessel = '';
    lloydsNumber = '';
    voyageRef?: bigint;
    voyageNumber = '';
    loadPortLocode = '';
    loadPortCallId?: bigint;
    loadPortCallType = '';
    loadTerminalName = '';
    loadTerminalCode = '';
    loadEtaDateTime?: Date;
    loadEtdDateTime?: Date;
    dischargeVoyageRef?: bigint;
    dischargeVoyageNumber = '';
    dischargePortLocode = '';
    dischargePortCallId?: bigint;
    dischargePortCallType = '';
    dischargeTerminalName = '';
    dischargeTerminalCode = '';
    dischargeEtaDateTime?: Date;
    dischargeEtdDateTime?: Date;

}
