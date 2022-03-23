import {MatSnackBar, MatSnackBarRef, TextOnlySnackBar} from "@angular/material/snack-bar";
import {ValidationExceptionModel} from "../model/exception/validation-exception.model";

export class SnackbarMessage {
  public static showErrorMessage(snackBar: MatSnackBar, error: any, messagePrefix?: string): MatSnackBarRef<any> {


    const errorModel = error.error && error.status ? error.error : error;
    if(errorModel.type && errorModel.validationIssues) {
      return SnackbarMessage.showValidationErrorMessage(snackBar, errorModel as ValidationExceptionModel, messagePrefix);
    } else {

      let reason = 'Unknown Error';
      if(errorModel.reason) {
        reason = errorModel.reason;
      } else if(errorModel.message) {
        reason = errorModel.message;
      }

      return SnackbarMessage.showGeneralErrorMessage(snackBar, reason, messagePrefix);
    }
  }

  public static showGeneralMessage(snackBar: MatSnackBar, message: string): MatSnackBarRef<TextOnlySnackBar> {
    return snackBar.open(message, 'Dismiss', {duration: 10000});
  }

  public static showGeneralErrorMessage(snackBar: MatSnackBar, reason: string, messagePrefix?: string): MatSnackBarRef<TextOnlySnackBar> {
    let message = messagePrefix ? messagePrefix : '';

    if(reason) {
      if(messagePrefix) {
        message += ': ';
      }
      message += reason;
    }

    return snackBar.open(message, 'Dismiss', {duration: 10000});
  }

  public static showValidationErrorMessage(snackBar: MatSnackBar,
                                           errorModel: ValidationExceptionModel,
                                           messagePrefix?: string): MatSnackBarRef<TextOnlySnackBar> {
    let message = messagePrefix ? messagePrefix : '';
    if(errorModel.validationIssues) {
      if(messagePrefix) {
        message += ': ';
      }

      const messageParts: string[] = errorModel.validationIssues.map(
        issue => {
          let issueMessage = '';
          if(issue.field) {
            issueMessage += issue.field;
          }

          if(issue.message) {
            if(issue.field) {
              issueMessage += ': ';
            }
            issueMessage += issue.message;
          }
          return issueMessage;
        });

      message += messageParts.join(', ');
    }

    if(message) {
      return snackBar.open(message, 'Dismiss', {duration: 10000});
    } else {
      return snackBar.open('Error', 'Dismiss', {duration: 10000});
    }
  }
}
