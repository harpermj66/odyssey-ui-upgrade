import {Pipe, PipeTransform} from '@angular/core';

/***
 * Sorts objects by the given fields.
 */
@Pipe({
    name: 'objectSort',
    pure: false
})
export class ObjectSortPipe implements PipeTransform {

    constructor() {
    }

    private static compareByField<T extends { [field: string]: any }>(a: T, b: T, field: string, ignoreCase: boolean): number {
        const aVal = a[field];
        const bVal = b[field];
        let aValString = aVal ? aVal.toString() : '';
        let bValString = bVal ? bVal.toString() : '';
        if (ignoreCase) {
            aValString = aValString.toLowerCase();
            bValString = bValString.toLowerCase();
        }

        return aValString.localeCompare(bValString);
    }

    private static compare<T extends { [field: string]: any }>(a: T, b: T, fields: string[], ignoreCase: boolean = true): number {
        let comp = 0;
        if (fields.length > 0) {
            const field = fields.shift();
            if (field) {
                comp = this.compareByField(a, b, field, ignoreCase);
                if (comp === 0) {
                    return this.compare(a, b, fields, ignoreCase);
                } else {
                    return comp;
                }
            }
        }

        return comp;
    }

    /**
     * Sorts an array of objects based on the given fields.
     *
     * @param val The array to sort.
     * @param fields The fields to sort by.
     * @param ignoreCase Whether to ignore the case of the field values (default: true).
     */
    transform<T extends { [field: string]: any }>(val: T[], fields: string | string[], ignoreCase: boolean = true): T[] {
        const valList = val ? val : [];
        const fieldList = !Array.isArray(fields) ? [fields] : fields.slice();

        if (fieldList.length > 0) {
            // Make a copy of the field list as we will be modifying this values contents.
            return valList.sort((a: T, b: T) => ObjectSortPipe.compare(a, b, fieldList.slice(), ignoreCase));
        } else {
            console.error('ObjectSortPipe received empty sort field list');
            return valList;
        }
    }
}
