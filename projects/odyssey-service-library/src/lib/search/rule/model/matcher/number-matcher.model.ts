import {AbstractRangeMatcherModel} from "./range-matcher.model";

/**
 * Matcher for number fields.
 */
export class NumberMatcherModel extends AbstractRangeMatcherModel<number> {
  public static readonly TYPENAME = 'NUMBER_MATCHER';

  constructor() {
    super(NumberMatcherModel.TYPENAME);
  }

  protected aIsBeforeB(a: number, b: number): boolean {
    return a < b;
  }

  protected createNewEntry(): number {
    return 0;
  }
}
