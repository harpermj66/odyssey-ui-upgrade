interface MultiSearchRuleModel extends AbstractSearchRuleModel {
  rules: AbstractSearchRuleModel[];
}

export abstract class AbstractSearchRuleModel {
  public static readonly TYPENAME_MULTI_RULE = 'MULTI_RULE';

  public id: string;

  protected constructor(public readonly type: string) {
    // TODO replace with better UUID generation, though these IDs only have to be unique between within the saved search.
    this.id = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public static getDescendants(parent: AbstractSearchRuleModel): AbstractSearchRuleModel[] {
    const descendants: AbstractSearchRuleModel[] = [];

    const toProcess: AbstractSearchRuleModel[] = [];
    if (parent.type === AbstractSearchRuleModel.TYPENAME_MULTI_RULE && (parent as MultiSearchRuleModel).rules) {
      (parent as MultiSearchRuleModel).rules.forEach(r => toProcess.push(r));
    }

    while (toProcess.length > 0) {
      const current = toProcess.shift();
      if (current) {
        descendants.push(current);

        if (current.type === AbstractSearchRuleModel.TYPENAME_MULTI_RULE && (current as MultiSearchRuleModel).rules) {
          (current as MultiSearchRuleModel).rules.forEach(r => toProcess.push(r));
        }
      }
    }

    return descendants;
  }

  public abstract asString(): string[];
}
