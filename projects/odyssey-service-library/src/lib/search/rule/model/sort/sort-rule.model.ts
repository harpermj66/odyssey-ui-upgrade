export class SortRuleModel {
  public static readonly ASC = 'ASC';
  public static readonly DESC = 'DESC';
  public static readonly DIRECTIONS = [SortRuleModel.ASC, SortRuleModel.DESC];

  field: string;
  direction: 'ASC' | 'DESC' = SortRuleModel.ASC;
}
