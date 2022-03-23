import {ValidationIssueModel} from "./validation-issue.model";

export class ValidationExceptionModel {
  public static readonly TYPE_ERROR = 'VALIDATION_ERROR';
  public static readonly TYPE_WARNING = 'VALIDATION_WARNING';

  type: 'VALIDATION_ERROR' | 'VALIDATION_WARNING';
  validationIssues: ValidationIssueModel[];

  public static isValidationException(errorModel: any): boolean {
    return errorModel &&
      (errorModel.type === ValidationExceptionModel.TYPE_ERROR || errorModel.type === ValidationExceptionModel.TYPE_WARNING)
      && (errorModel.validationIssues && Array.isArray(errorModel.validationIssues));
  }
}
