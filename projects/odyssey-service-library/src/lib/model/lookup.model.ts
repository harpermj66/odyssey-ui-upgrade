export class LookupModel {
  /**
   * The path relative to the gateway that is used for the lookup.
   * Using the token {filter} in the path indicates the token {filter} should be replaced with the filter value.
   * Using the token {field} in the path indicates the token {field} should be replaced with the dependency value.
   */
  readonly path: string;

  /**
   * The looked up field that maps to the annotated field.
   */
  readonly field: string;

  /**
   * A map of lookup entity field names to the target model fields they map to.
   */
  readonly mappedFields: { [lookupField: string]: string };

  /**
   * The fields to display in the UI.
   */
  displayFields: string[];

  /**
   * A map of query parameter names to their values.
   * Using the token {filter} in the value indicates the token {filter} should be replaced with the filter value.
   * Using the token {field} in the path indicates the token {field} should be replaced with the dependency value.
   */
  readonly params: { [paramName: string]: string };

  /**
   * The looked up field that this depends on.
   * Only present in linked lookups.
   */
  readonly dependentField?: string;

  /**
   * The field mapped to the lookup field that this depends on.
   * Only present in linked lookups.
   */
  readonly dependentMappedField?: string;

  public static isLinkedLookup(lookup: LookupModel): boolean {
    return !!lookup.dependentField && !!lookup.dependentMappedField;
  }

  /**
   * Get a list of any linked lookups in the given list.
   * Linked lookups are mapped to their model fields.
   * @param lookups The list of lookups to search.
   * @param filterFields A list of mapped fields, if defined then only the linked lookups for these fields will be returned.
   */
  public static getLinkedLookups(lookups: LookupModel[], filterFields?: string[]): LinkedLookupModel[] {
    return lookups.filter(l => l.dependentMappedField && LookupModel.isLinkedLookup(l)
        && (!filterFields || filterFields.includes(l.dependentMappedField))).map(l => l as LinkedLookupModel);
  }

  public static getNonLinkedLookups(lookups: LookupModel[]): LookupModel[] {
    return lookups.filter(l => !LookupModel.isLinkedLookup(l));
  }
}

export class LinkedLookupModel extends LookupModel {
  /**
   * The looked up field that this depends on.
   * Only present in linked lookups.
   */
  readonly dependentField: string;

  /**
   * The field mapped to the lookup field that this depends on.
   * Only present in linked lookups.
   */
  readonly dependentMappedField: string;
}
