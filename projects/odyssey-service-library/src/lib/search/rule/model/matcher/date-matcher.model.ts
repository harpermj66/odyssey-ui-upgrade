import {AbstractRangeMatcherModel} from "./range-matcher.model";

/**
 * Search rule for matching dates.
 */
export class DateMatcherModel extends AbstractRangeMatcherModel<Date> {
  public static readonly TYPENAME = 'DATE_MATCHER';

  /**
   * Whether the dates included should be treated as dates with times or dates without times.
   * Indicator to be used in the back end calculation.
   */
  public fullDateTime = true;

  constructor() {
    super(DateMatcherModel.TYPENAME);
  }

  protected aIsBeforeB(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime();
  }

  protected createNewEntry(): Date {
    return new Date();
  }
}
