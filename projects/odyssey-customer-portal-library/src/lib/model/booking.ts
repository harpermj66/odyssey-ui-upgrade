import { ContainerEvent } from "./container-event";
import { Leg } from "./leg";

export class Booking {
    bookingNumber: string;
    blNumber: string[];
    siNumber: string[];
    pol: string;
    pod: string;
    legs: Leg[];
    containerEvents: ContainerEvent[];
}

