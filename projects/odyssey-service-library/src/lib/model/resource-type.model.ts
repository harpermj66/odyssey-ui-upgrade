import {ResourceAttributeModel} from "./resource-attribute.model";
import {LookupModel} from "./lookup.model";

export class ResourceTypeModel {
  resourceName: string;
  keyField: string;
  resourceAttributes: ResourceAttributeModel[];
  defaultDisplayColumns: string[] = [];
  lookups: { [fieldName: string]: LookupModel[] };
}
