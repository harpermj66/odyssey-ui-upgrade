import {ContainerTimelineNode} from "./container-timeline-node";


export class ContainerTimeline {
    index: number;
    containerNumber?: string;
    bookingNumber?: string;
    siNumbers?: string[];
    blNumbers?: string[];
    nodes: ContainerTimelineNode[];
}
