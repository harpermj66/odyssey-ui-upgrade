import {AbstractSearchRuleModel} from "./search-rule.model";

/**
 * A search rule for the combined logical output of multiple rules.
 */
export class MultiSearchRuleModel extends AbstractSearchRuleModel {
  public static readonly TYPENAME = 'MULTI_RULE';
  public static readonly OPERATOR_AND = 'AND';
  public static readonly OPERATOR_OR = 'OR';
  public static readonly OPERATORS = [MultiSearchRuleModel.OPERATOR_OR, MultiSearchRuleModel.OPERATOR_AND];

  public operator: 'OR' | 'AND' = MultiSearchRuleModel.OPERATOR_AND;
  public rules: AbstractSearchRuleModel[] = [];

  constructor() {
    super(MultiSearchRuleModel.TYPENAME);
  }

  asString(): string[] {
    const parts: string[] = [];
    if(this.rules) {
      const addBrackets = this.rules.length > 1;
      if(addBrackets) {
        parts.push('(');
      }
      parts.push(this.rules.map(a => a.asString().join(' ')).join(' ' + this.operator.toLowerCase() + ' '));
      if(addBrackets) {
        parts.push(')');
      }
    }
    return parts;
  }
}
