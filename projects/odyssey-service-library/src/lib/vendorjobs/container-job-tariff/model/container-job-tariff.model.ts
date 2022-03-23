export class ContainerJobTariffModel {
  id?: string;
  companyId?: number;
  companyName?: string;
  depotId?: number;
  depotName?: string;
  currencyId?: number;
  currencyShort?: string;
  validFrom?: string;
  validTo?: string;
  jobType?: string;
  hazardous? = 'BOTH';
  empty? = 'BOTH';
  containerCategories?: string[];
  amounts?: {[key: string]: number} = {};
  created?: Date;
}
