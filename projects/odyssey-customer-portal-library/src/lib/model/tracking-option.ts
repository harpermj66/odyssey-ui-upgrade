export enum TrackingOption {
    Container = 'container',
    Booking = 'booking',
    ShippingInstruction = 'si',
    BillOfLading = 'bl',
}

export class SearchOption{
    displayName: string;
    value: string;
    default: boolean;
}

export const searchOptions: SearchOption[] = [
    { displayName: 'Container Number', value: TrackingOption.Container, default: true },
    { displayName: 'Booking Number', value: TrackingOption.Booking, default: false },
    { displayName: 'SI Number', value: TrackingOption.ShippingInstruction, default: false },
    { displayName: 'BL Number', value: TrackingOption.BillOfLading, default: false },
];

export function getDefaultSearchOption(): SearchOption {
    const defaultOption = searchOptions.find(op => op.default);

    if (defaultOption === undefined) {
        throw new TypeError('No default SearchOption found.');
    }

    return defaultOption;
}

export function getSearchOptionByValue(value: string): SearchOption{
    let option = searchOptions.find(op => op.value === value);

    if(option === undefined){
        option = searchOptions[0];
    }

    return option;
}
