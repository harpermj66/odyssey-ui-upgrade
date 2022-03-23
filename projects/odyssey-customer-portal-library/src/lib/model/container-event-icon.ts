export class ContainerEventIcon {
    eventType: string;
    iconName: string;
}

export const containerEventIcons: ContainerEventIcon[] = [
    { eventType: 'depot gate in', iconName: 'local_shipping'},
    { eventType: 'depot gate out', iconName: 'local_shipping'},
    { eventType: 'discharged', iconName: 'directions_boat'},
    { eventType: 'loaded onboard', iconName: 'directions_boat'},
    { eventType: 'other location in', iconName: 'directions_boat'},
    { eventType: 'other location out', iconName: 'directions_boat'},
    { eventType: 'terminal gate in', iconName: 'local_shipping'},
    { eventType: 'terminal gate out', iconName: 'local_shipping'},
    { eventType: 'awaiting packing', iconName: 'archive'},
    { eventType: 'awaiting unpacking', iconName: 'unarchive'},
    { eventType: 'packed', iconName: 'inventory_2'},
    { eventType: 'unpacked', iconName: 'inventory_2'},
];

export function getIconForContainerEvent(eventType: string): string {
    let eventIcon = containerEventIcons.find(mapping => mapping.eventType === eventType.toLowerCase());

    return eventIcon ? eventIcon.iconName : 'question_mark';
}
