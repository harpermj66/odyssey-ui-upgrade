import {Currency} from "./currency";
import { UnLocode } from '../../../../odyssey-service-library/src/lib/model/lookup/un-locode';

export class Company {
    companyName: string;
    shortName: string;
    carrierId: number;
    currency: Currency;
    unLocode: UnLocode;
    eori: string;
    address: string;
    country: string;
    city: string;
    postcode: string;
    phone: string;
    fax: string;
}
