import {AbstractSearchRuleModel} from "./search-rule.model";
import {AbstractFieldMatcherModel} from "./matcher/field-matcher.model";

/**
 * Basic field-matcher object.
 */
export class FieldSearchRuleModel extends AbstractSearchRuleModel {
  public static readonly TYPENAME = 'FIELD_RULE';

  public field: string;
  public matcher: AbstractFieldMatcherModel | null;

  constructor() {
    super(FieldSearchRuleModel.TYPENAME);
  }

  public asString(): string[] {
    let parts: string[] = [];
    if(this.field && this.matcher) {
      parts = this.matcher?.asString(this.field);
    }
    return parts;
  }
}
