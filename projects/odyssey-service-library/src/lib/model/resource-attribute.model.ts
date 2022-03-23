export class ResourceAttributeModel {
  name: string;
  description: string;
  type: string;
  excludeFromGroupings: boolean;
  canSumOn: boolean;
  displayable: boolean;
  canSortOn: boolean;
  collection: boolean;
  nestedAttributeTypes?: ResourceAttributeModel[];
}
