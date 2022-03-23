import {AbstractFieldMatcherModel} from "./field-matcher.model";

export abstract class AbstractRangeMatcherModel<T> extends AbstractFieldMatcherModel {
  public static readonly OPERATOR_RANGE = 'RANGE';
  public static readonly OPERATOR_BEFORE = 'BEFORE';
  public static readonly OPERATOR_AFTER = 'AFTER';
  public static readonly OPERATOR_EQUAL = 'EQUAL';
  public static readonly OPERATORS = [
    AbstractRangeMatcherModel.OPERATOR_BEFORE,
    AbstractRangeMatcherModel.OPERATOR_AFTER,
    AbstractRangeMatcherModel.OPERATOR_RANGE
  ];

  public static readonly OPERATORS_WTIH_EQUAL = [
    AbstractRangeMatcherModel.OPERATOR_EQUAL,
    AbstractRangeMatcherModel.OPERATOR_BEFORE,
    AbstractRangeMatcherModel.OPERATOR_AFTER,
    AbstractRangeMatcherModel.OPERATOR_RANGE
  ];

  /**
   * The operator, entries will be exclusive unless the operator is in 'range' mode.
   */
  public operator: 'BEFORE' | 'AFTER' | 'RANGE' = 'BEFORE';

  /**
   * The list of values, will be a single value unless this is a range match.
   */
  public values: T[] = [this.createNewEntry()];

  public setRange(date1: T, date2: T): void {
    let startDate: T;
    let endDate: T;
    if(this.aIsBeforeB(date1, date2)) {
        startDate = date1;
        endDate = date2;
      } else {
        startDate = date2;
        endDate = date2;
      }

    this.values = [startDate, endDate];
  }

  protected abstract createNewEntry(): T;

  protected abstract aIsBeforeB(a: T, b: T): boolean;

  public asString(fieldName: string): string[] {
    const stringVal: string[] = [];
    if(this.operator === AbstractRangeMatcherModel.OPERATOR_RANGE) {
      this.setRange(this.values[0], this.values[1]);
      stringVal.push(this.values[0] ? String(this.values[0]) : 'null');
      stringVal.push('<');
      stringVal.push(fieldName);
      stringVal.push('<');
      stringVal.push(this.values[1] ? String(this.values[1]) : 'null');
    } else {
      stringVal.push(fieldName);
      stringVal.push(this.operator === AbstractRangeMatcherModel.OPERATOR_AFTER ? '<' : '>');
      stringVal.push(this.values[0] ? String(this.values[0]) : 'null');
    }
    return stringVal;
  }
}
