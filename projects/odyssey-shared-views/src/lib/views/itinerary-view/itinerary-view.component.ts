import {Component, Input} from '@angular/core';
import {ItineraryLeg} from "./itinerary.model";

@Component({
    selector: 'lib-itinerary-view',
    templateUrl: './itinerary-view.component.html',
    styleUrls: ['./itinerary-view.component.scss']
})
export class ItineraryViewComponent {

    @Input()
    itinerary: ItineraryLeg[];

    get finalLeg(): ItineraryLeg {
        return this.itinerary[this.itinerary.length - 1];
    }

    private separator = " → ";

    private _simpleItinerary: string;
    get simpleItinerary(): string {
        if (!this.itinerary || this.itinerary.length === 0) {
            return "";
        }
        return this.itinerary
                .map(leg => leg.loadPortLocode + ` (${leg.voyageNumber} - ${this.formatDate(leg.loadEtdDateTime)})`)
                .join(this.separator)
            + this.separator + this.finalLeg.dischargePortLocode +
            ` (${this.formatDate(this.finalLeg.dischargeEtaDateTime)})`;
    }

    private _tooltip: string;
    get tooltip(): string {
        if (!this.itinerary || this.itinerary.length === 0) {
            return "";
        }

        let tt = "";

        // header
        tt += '[' + Object.getOwnPropertyNames(displayItineraryFields)
            .map(property => displayItineraryFields[property])
            .join(', ') + '],\n';

        // rows
        tt += this.itinerary
            .map(leg => "[" + ItineraryViewComponent.getLegStr(leg) + "]")
            .join(',\n');

        return tt;
    }

    private static getLegStr(leg: ItineraryLeg): string {
        return Object.getOwnPropertyNames(displayItineraryFields)
            .map(property => leg[property])
            .map(value => !!value ? value : "unknown")
            .map(value => value.toString())
            .join(', ');
    }

    formatDate(date: Date | undefined): string {
        if (date) {
            return new Date(date).toISOString().substr(0, 10); // ISO date part only
        } else {
            return "";
        }
    }

    toTitleCase(str: string): string {
        return str.replace(
            /\w\S*/g,
            txt => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

}


const displayItineraryFields: { [key: string]: string } = {
    itineraryType: "Itinerary Type",
    legIndex: "Leg No.",
    tradeRoute: "Trade Route",
    vessel: "Vessel",
    lloydsNumber: "Lloyds",
    voyageRef: "Voyage Ref",
    voyageNumber: "Voyage Number",
    loadPortLocode: "Load Port Locode",
    loadPortCallId: "Load Port Call Id",
    loadPortCallType: "Load Call Type",
    loadTerminalName: "Load Terminal Name",
    loadTerminalCode: "Load Terminal Code",
    loadEtaDateTime: "Load Eta",
    loadEtdDateTime: "Load Etd",
    dischargeVoyageRef: "Discharge Voyage Ref",
    dischargeVoyageNumber: "Discharge Voyage Number",
    dischargePortLocode: "Discharge Port Locode",
    dischargePortCallId: "Discharge Port Call Id",
    dischargePortCallType: "Discharge Call Type",
    dischargeTerminalName: "Discharge Terminal Name",
    dischargeTerminalCode: "Discharge Terminal Code",
    dischargeEtaDateTime: "Discharge Eta",
    dischargeEtdDateTime: "Discharge Etd",
};
