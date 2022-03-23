export class SortOption {
    displayName: string;
    value: string;
    default: boolean;
}

export class SortOrder {
    displayName: string;
    value: string;
    default: boolean;
}

export const sortOptions: SortOption[] = [
    { displayName: "Departure", value: "departure", default: true },
    { displayName: "Arrival", value: "arrival", default: false },
    { displayName: "Duration", value: "duration", default: false },
];

export const sortOrders: SortOrder[] = [
    { displayName: "Ascending", value: "asc", default: true },
    { displayName: "Descending", value: "desc", default: false },
];



export function getDefaultSortOption(): SortOption {
    const defaultOption = sortOptions.find(op => op.default);

    if (defaultOption === undefined) {
        throw new TypeError('No default SortOption found.');
    }

    return defaultOption;
}

export function getDefaultSortOrder(): SortOrder {
    const defaultOrder = sortOrders.find(order => order.default);

    if (defaultOrder === undefined) {
        throw new TypeError('No default SortOrder found.');
    }

    return defaultOrder;
}
