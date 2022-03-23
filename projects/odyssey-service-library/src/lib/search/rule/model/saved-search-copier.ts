import {AbstractSearchRuleModel} from "./search-rule.model";
import {SortRuleModel} from "./sort/sort-rule.model";
import {SavedSearchModel} from "./saved-search.model";
import {MultiSearchRuleModel} from "./multi-search-rule.model";
import {FieldSearchRuleModel} from "./field-search-rule.model";
import {AbstractFieldMatcherModel} from "./matcher/field-matcher.model";
import {DateMatcherModel} from "./matcher/date-matcher.model";
import {StringMatcherModel} from "./matcher/string-matcher.model";
import {NumberMatcherModel} from "./matcher/number-matcher.model";
import {GroupingRuleModel} from "./grouping/grouping-rule.model";
import {SumFieldModel} from "./grouping/sum-field.model";

/**
 * Class for copying/deserialising entities related saved searches.
 */
export class SavedSearchCopier {
  public static copySavedSearch(object: {[key: string]: any}): SavedSearchModel | null {
    let copied: SavedSearchModel | null = null;
    if(object) {
      copied = Object.assign(new SavedSearchModel(), object);
      if(copied.searchRule) {
        copied.searchRule = SavedSearchCopier.copySearchRuleModel(copied.searchRule);
      }

      if(copied.createdDate) {
        copied.createdDate = new Date(copied.createdDate);
      }

      if(copied.updatedDate) {
        copied.updatedDate = new Date(copied.updatedDate);
      }

      const copiedSorts: SortRuleModel[] = [];
      if(copied.sortRules) {
        copied.sortRules.forEach(sort => {
          const copiedSort = SavedSearchCopier.copySortRule(sort);
          if(copiedSort) {
            copiedSorts.push(copiedSort);
          }
        });
      }
      copied.sortRules = copiedSorts;

      const copiedGroupings: GroupingRuleModel[] = [];
      if(copied.groupingRules) {
        copied.groupingRules.forEach(sort => {
          const copiedGroup = SavedSearchCopier.copyGroupRule(sort);
          if(copiedGroup) {
            copiedGroupings.push(copiedGroup);
          }
        });
      }
      copied.groupingRules = copiedGroupings;
    }
    return copied;
  }

  public static copySearchRuleModel(object: {[key: string]: any}): AbstractSearchRuleModel | null {
    let copied: AbstractSearchRuleModel | null = null;

    if(SavedSearchCopier.canCopyMultiSearchRule(object)) {
      copied = SavedSearchCopier.copyMultiSearchRule(object);
    } else if(SavedSearchCopier.canCopyFieldSearchRuleModel(object)) {
      copied = SavedSearchCopier.copyFieldSearchRuleModel(object);
    }

    return copied;
  }

  public static copySortRule(object: { [p: string]: any }): SortRuleModel | null {
    let copied: SortRuleModel | null = null;

    if(object) {
      copied = Object.assign(new SortRuleModel(), object);
    }

    return copied;
  }

  public static copyGroupRule(object: { [p: string]: any }): GroupingRuleModel | null {
    let copied: GroupingRuleModel | null = null;

    if(object) {
      copied = Object.assign(new GroupingRuleModel(), object);

      const copiedSums: SumFieldModel[] = [];
      // if(copied.sumFields) {
      //   copied.sumFields.forEach(sort => {
      //     const copiedSum = SavedSearchCopier.copySumField(sort);
      //     if(copiedSum) {
      //       copiedSums.push(copiedSum);
      //     }
      //   });
      // }
      // copied.sumFields = copiedSums;
    }

    return copied;
  }

  public static copySumField(object: { [p: string]: any }): SumFieldModel | null {
    let copied: SumFieldModel | null = null;

    if(object) {
      copied = Object.assign(new SumFieldModel(), object);
    }

    return copied;
  }

  public static canCopyMultiSearchRule(object: { [p: string]: any }): boolean {
    return object && object.type === MultiSearchRuleModel.TYPENAME;
  }

  public static copyMultiSearchRule(object: { [p: string]: any }): MultiSearchRuleModel | null {
    let copied: MultiSearchRuleModel | null = null;
    if(SavedSearchCopier.canCopyMultiSearchRule(object)) {
      copied = Object.assign(new MultiSearchRuleModel(), object);

      // copy sub-rules
      const copiedRules: AbstractSearchRuleModel[] = [];
      if(copied.rules) {
        copied.rules.forEach((subRule: AbstractSearchRuleModel) => {
          if(subRule) {
            const copiedSubRule = SavedSearchCopier.copySearchRuleModel(subRule);
            if(copiedSubRule) {
              copiedRules.push(copiedSubRule);
            }
          }
        });
      }

      copied.rules = copiedRules;
    }
    return copied;
  }

  public static canCopyFieldSearchRuleModel(object: { [p: string]: any }): boolean {
    return object && object.type === FieldSearchRuleModel.TYPENAME;
  }

  public static copyFieldSearchRuleModel(object: { [p: string]: any }): FieldSearchRuleModel | null {
    let copied: FieldSearchRuleModel | null = null;

    if(SavedSearchCopier.canCopyFieldSearchRuleModel(object)) {
      copied = Object.assign(new FieldSearchRuleModel(), object);
      if(copied.matcher) {
        copied.matcher = SavedSearchCopier.copyFieldMatcher(copied.matcher);
      }
    }

    return copied;
  }

  public static copyFieldMatcher(object: {[key: string]: any}): AbstractFieldMatcherModel | null {
    let matcher: AbstractFieldMatcherModel | null = null;

    if(SavedSearchCopier.canCopyDateMatcher(object)) {
      matcher = SavedSearchCopier.copyDateMatcher(object);
    } else if(SavedSearchCopier.canCopyStringMatcher(object)) {
      matcher = SavedSearchCopier.copyStringMatcher(object);
    } else if(SavedSearchCopier.canCopyNumberMatcher(object)) {
      matcher = SavedSearchCopier.copyNumberMatcher(object);
    }

    return matcher;
  }

  public static canCopyDateMatcher(object: { [p: string]: any }): boolean {
    return object && object.type === DateMatcherModel.TYPENAME;
  }


  public static copyDateMatcher(object: { [p: string]: any }): DateMatcherModel | null {
    let copied: DateMatcherModel | null = null;

    if(SavedSearchCopier.canCopyDateMatcher(object)) {
      copied = Object.assign(new DateMatcherModel(), object);
      const copiedValues: Date[] = [];

      if(copied.values) {
        // Copied across dates, and convert them if they are as strings or numbers.
        copied.values.forEach((subRule: any) => {
          if(subRule) {
            copiedValues.push(new Date(subRule));
          }
        });
      }
      copied.values = copiedValues;
    }

    return copied;
  }

  public static canCopyStringMatcher(object: { [p: string]: any }): boolean {
    return object && object.type === StringMatcherModel.TYPENAME;
  }

  public static copyStringMatcher(object: { [p: string]: any }): StringMatcherModel | null {
    return SavedSearchCopier.canCopyStringMatcher(object) ? Object.assign(new StringMatcherModel(), object) : null;
  }

  public static canCopyNumberMatcher(object: { [p: string]: any }): boolean {
    return object && object.type === NumberMatcherModel.TYPENAME;
  }

  public static copyNumberMatcher(object: { [p: string]: any }): NumberMatcherModel | null {
    return SavedSearchCopier.canCopyNumberMatcher(object) ? Object.assign(new NumberMatcherModel(), object) : null;
  }
}
