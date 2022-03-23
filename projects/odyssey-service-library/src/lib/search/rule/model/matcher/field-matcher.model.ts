export abstract class AbstractFieldMatcherModel {
  protected constructor(public readonly type: string) {
  }

  public abstract asString(fieldName: string): string[];
}
