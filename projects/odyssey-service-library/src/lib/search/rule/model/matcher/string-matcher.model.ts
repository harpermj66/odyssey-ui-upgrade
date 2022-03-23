import {AbstractFieldMatcherModel} from "./field-matcher.model";

/**
 * Basic field-value matching rule.
 */
export class StringMatcherModel extends AbstractFieldMatcherModel {
  public static readonly TYPENAME = 'STRING_MATCHER';
  public static readonly OPERATORS = ['EQUALS', 'NOT_EQUALS', 'STARTS_WITH', 'ENDS_WITH', 'CONTAINS', 'LIKE', 'NOT_LIKE'];

  public operator: 'EQUALS' | 'NOT_EQUALS' | 'STARTS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'LIKE' | 'NOT_LIKE' = 'EQUALS';
  public values: string[] = [];

  constructor() {
    super(StringMatcherModel.TYPENAME);
  }

  public asString(fieldName: string): string[] {
    const parts: string[] = [];
    parts.push(fieldName);
    parts.push(this.operator.replace(/_/g, ' ').toLowerCase());
    parts.push(this.values[0] ? '"' + this.values[0] + '"' : '""');
    return parts;
  }
}
