import {Leg} from "./leg";

export class ContainerTimelineNode {
    voyageNo?: string;
    vesselName?: string;
    imoNumber?: string;

    locode?: string;
    containerNumber: string;
    eventType: string;
    eventDate: string;

    bookingNumber?: string;
    siNumbers?: string[];
    blNumbers?: string[];

    legs: Leg[];
}
