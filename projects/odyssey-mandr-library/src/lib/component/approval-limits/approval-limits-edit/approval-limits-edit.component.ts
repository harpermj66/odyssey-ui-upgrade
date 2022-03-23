import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges
} from "@angular/core";
import {ApprovalsModel} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/model/approvals.model";
import {ApprovalLimitsService} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/service/approval-limits.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {ActivatedRoute, Router} from "@angular/router";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {ApprovalsContType} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/model/approvals-contType";
import {CurrencyService} from "../../../../../../odyssey-service-library/src/lib/mandr/currency/service/currency.service";
import {ContTypeGroupVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/approval-limits/model/cont-type-group-vo.model";
import {ContTypeGroupService} from "../../../../../../odyssey-service-library/src/lib/mandr/cont-type-group/service/cont-type-group.service";
import {DepotVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/depot-vo.model";
import {CurrencyVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/shared/model/currency-vo.model";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {Observable} from "rxjs";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {FormControlBuilder} from "../../../../../../odyssey-shared-views/src/lib/utils/form-control-builder";
import {
  AlwaysShowErrorStateMatcher,
  FunctionErrorStateMatcher
} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";
import {ErrorStateMatcher} from "@angular/material/core";
import {Arrays} from "../../../../../../odyssey-service-library/src/lib/utils/arrays";
import {ChangeDetector} from "../../../../../../odyssey-service-library/src/lib/utils/change-detector";

class ContApprovalLimitsErrorMatchers {
  matchers: { [contType: string]: ErrorStateMatcher } = {};

  constructor(private comp: ApprovalLimitsEditComponent) {
  }

  get(contType: string): ErrorStateMatcher {
    if (!this.matchers[contType]) {
      this.matchers[contType] = new FunctionErrorStateMatcher(() => {
        return !!this.comp.validationIssues['contApprovalLimits_' + contType];
      });
    }
    return this.matchers[contType];
  }
}

class EmailToErrorMatcher extends ErrorStateMatcher {
  constructor(private component: ApprovalLimitsEditComponent) {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.component.validationIssues.emailTo || control?.getError('email') ||
      (control?.getError('required') && (!this.component?.approvalLimit?.emailTo || this.component?.approvalLimit?.emailTo.length === 0));
  }
}

@Component({
  selector: 'lib-approval-limits-edit',
  templateUrl: './approval-limits-edit.component.html',
  styleUrls: ['./approval-limits-edit.component.scss'],
  providers: [
    SubscriptionsManager,
    RequestQueue
  ]
})
export class ApprovalLimitsEditComponent implements OnInit, OnChanges, AfterViewInit {

  readonly emailFrom = 'emailFrom';
  readonly emailTo = 'emailTo';
  readonly containerLimitValidationPrefix = 'contApprovalLimits_';

  @Input() disabled: boolean;
  _readonly: boolean;
  @Input() value: string | null = null;

  _approvalLimit: ApprovalsModel = new ApprovalsModel();
  emailFromCtl = FormControlBuilder.buildEmailControl(this._approvalLimit, this.emailFrom, true);
  emailToCtl = new FormControl('', [Validators.required, Validators.email]);
  emailCcCtl = new FormControl('', [Validators.email]);
  emailBccCtl = new FormControl('', [Validators.email]);

  approvalsContTypes: ApprovalsContType[] = [];
  contTypeGroupVoModel: ContTypeGroupVoModel[] = [];

  approvalLimitIdBinding: number | null;
  approvalLimitIdQuery: number | null;

  approvalLimitStringified?: string;

  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  savingQueue = new RequestQueue();

  @Output() dynamicColumns: string[]= [] ;

  @Input() contType: Array<string> = [];

  @Input() contTypeToBeSaved: Array<string> = [];

  pageSettings = {
    total: 0,
    pageSize: 10,
    pageNumber: 0,
  };

  validationIssues: { [field: string]: string } = {};

  errorMatcher = new AlwaysShowErrorStateMatcher();
  emailToErrorMatcher = new EmailToErrorMatcher(this);

  contApprovalLimitsErrorMatchers = new ContApprovalLimitsErrorMatchers(this);

  constructor(private approvalLimitsService: ApprovalLimitsService,
              private currencyService: CurrencyService,
              private contTypeGroupService: ContTypeGroupService,
              private loadingQueue: RequestQueue,
              private dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private userService: CurrentUserService,
              private snackBar: MatSnackBar,
              @Optional() public dialogRef: MatDialogRef<ApprovalLimitsEditComponent>,
              private subscriptionManager: SubscriptionsManager,
              private route: ActivatedRoute,
              private router: Router,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: {
      approvalId: number,
      readonly: boolean,
      disabled: boolean
    }) {

    if (this.data) {
      this.approvalLimitIdBinding = this.data.approvalId;
      this.disabled = this.data.disabled;
      this.readonly = this.data.readonly;
      this.approvalLimit.id = this.data.approvalId;
      this.loadApproval();
    } else {
      const queryParam = route.snapshot.queryParams.approvalLimitId;
      if(queryParam) {
        this.approvalLimitIdQuery = queryParam;
      }
      this.loadApproval();
    }

    this.subscriptionManager.addDestroyable(this.savingQueue);
    this.subscriptionManager.addChangeDetector(this.changeDetector);
  }

  get isMainDialog(): boolean {
    // Ensure wqe are the main dialog ref, we may end up with a parent components ref
    return this.dialogRef?.componentInstance === this;
  }

  get loadingApproval(): boolean {
    return this.loadingQueue.loading;
  }

  get saving(): boolean {
    const saving = this.savingQueue.loading;
    if (saving || this.disabled) {
      this.emailToCtl.disable();
      this.emailFromCtl.disable();
      this.emailCcCtl.disable();
      this.emailBccCtl.disable();
    } else if (!this.disabled) {
      this.emailToCtl.enable();
      this.emailFromCtl.enable();
      this.emailCcCtl.enable();
      this.emailBccCtl.enable();
    }
    return saving;
  }

  ngOnInit(): void {
    this.subscriptionManager.addSub(
      this.route.queryParams.subscribe(
        params => {
          if(!this.approvalLimitIdBinding) {
            this.approvalLimitIdQuery = params.approvalLimitId;
            this.loadApproval();
          }
        }
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.approvalLimitId) {
      this.approvalLimitIdQuery = null;
      this.loadApproval();
    }
  }

  ngAfterViewInit(): void {
    if(this.isMainDialog && this.dialogRef && !this.readonly) {
      this.dialogRef.disableClose = true;
    }
  }

  get readonly(): boolean {
    return this._readonly
      || this.route.snapshot.queryParams.mode === 'view'
      || (!this.userService.user?.roles.MR_APPROVER && !this.userService.user?.roles.MR_EDITOR);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  @Input() set approvalLimitId(id: number | null) {
    this.approvalLimitIdBinding = id;
  }

  get approvalLimitId(): number | null {
    return (this.approvalLimit && this.approvalLimit.id) ? this.approvalLimit.id :
      (this.approvalLimitIdBinding ? this.approvalLimitIdBinding : this.approvalLimitIdQuery);
  }

  get loading(): boolean {
    return this.loadingApproval;
  }

  get busy(): boolean {
    return this.saving || this.loading;
  }

  get canSave(): boolean {
    return !this.busy && !this.disabled && !this.hasValidationIssues && this.hasChanges();
  }

  get hasValidationIssues(): boolean {
    if(!this.approvalLimit) {
      return true;
    }

    for(const key in this.validationIssues) {
      if(this.validationIssues[key] && key.startsWith(this.containerLimitValidationPrefix)) {
        return true;
      }
    }

    if(this.emailToCtl.getError('email')
      || (this.emailToCtl.getError('required') && (!this.approvalLimit.emailTo || this.approvalLimit.emailTo.length === 0))) {
      return true;
    }

    if(this.emailFromCtl.errors) {
      return true;
    }

    if(this.emailBccCtl.errors) {
      return true;
    }

    if(this.emailCcCtl.errors) {
      return true;
    }

    if(!this.approvalLimit.depot) {
      return true;
    }

    if(!this.approvalLimit.currency) {
      return true;
    }

    return false;
  }

  get approvalLimit(): ApprovalsModel {
    return this._approvalLimit;
  }

  set approvalLimit(approval: ApprovalsModel) {
    if (this._approvalLimit !== approval) {
      this.emailFromCtl.setValue(approval.emailFrom);
    }
    this._approvalLimit = approval;
  }

  private loadApproval(): void {
    this.loadContTypeGroups();
    const limitId = this.approvalLimitId;
    if (limitId) {
      this.loadingQueue.makeRequest(
        this.approvalLimitsService.getApproval(limitId),
        approval => {
          this.approvalLimit = approval;
          this.onLoadComplete();
        },
        error => {
          SnackbarMessage.showErrorMessage(this.snackBar, error, 'Failed to load container type groups');
        });
    } else {
      this.approvalLimit = new ApprovalsModel();
      this.onLoadComplete();
    }
  }

  private loadContTypeGroups(): void {
    this.loadingQueue.makeRequest(
      this.contTypeGroupService.getContTypeGroupsByType(ContTypeGroupService.GROUP_TYPE_CONTAINER),
      contTypeGroups => {
        this.contTypeGroupVoModel = contTypeGroups;
      },
      error => {
        SnackbarMessage.showErrorMessage(this.snackBar, error, 'Failed to load container type groups');
      });
  }

  private onLoadComplete(): void {
    this.approvalLimitStringified = JSON.stringify(this.approvalLimit);
  }

  public hasChanges(): boolean {
    return this.approvalLimitStringified !== JSON.stringify(this.approvalLimit) ||
      this.emailFromCtl.value !== this.approvalLimit.emailFrom ||
      (this.emailToCtl.value && !Arrays.contains(this.approvalLimit.emailTo, this.emailToCtl.value)) ||
      (this.emailCcCtl.value && !Arrays.contains(this.approvalLimit.emailCc, this.emailCcCtl.value)) ||
      (this.emailBccCtl.value && !Arrays.contains(this.approvalLimit.emailBcc, this.emailBccCtl.value));
  }

  public save(): void {
    let obs: Observable<ApprovalsModel>;
    const id = this.approvalLimitId;
    if (id) {
      obs = this.approvalLimitsService.updateApproval(id, this.approvalLimit);
    } else {
      obs = this.approvalLimitsService.createOrUpdateApproval(this.approvalLimit);
    }

    this.validationIssues = {};

    this.approvalLimit.emailTo = this.getEmailList(this.approvalLimit.emailTo, this.emailToCtl);
    this.approvalLimit.emailCc = this.getEmailList(this.approvalLimit.emailCc, this.emailCcCtl);
    this.approvalLimit.emailBcc = this.getEmailList(this.approvalLimit.emailBcc, this.emailBccCtl);

    this.approvalLimit.emailFrom = this.emailFromCtl.value;

    this.savingQueue.makeRequest(
      obs,
      approvals => {
        this.approvalLimit = approvals;
        this.onLoadComplete();
      },
      error => {
        if (ValidationExceptionModel.isValidationException(error.error)) {
          this.handleValidationIssues(error.error as ValidationExceptionModel);
        } else {
          SnackbarMessage.showErrorMessage(this.snackBar, error, 'Could not save approval limit');
        }
      }
    );
  }

  /**
   * Get the complete list of emails for a given email form control.
   * Will add the value of input control to the list if it is not already there.
   *
   * @param currentList
   * @param emailInputCtl
   * @private
   */
  private getEmailList(currentList: string[] | undefined, emailInputCtl: FormControl): string[] {
    const emailList: string[] = [];
    if(currentList) {
      currentList.forEach( a => emailList.push(a));
    }

    // Get the value that is in the input and add it to the list
    const inputVal = emailInputCtl.value;
    if(inputVal && inputVal.trim() !== '' && !emailList.includes(inputVal.trim())) {
      emailList.push(inputVal.trim());
    }
    emailInputCtl.setValue('');
    return emailList;
  }

  private handleValidationIssues(error: ValidationExceptionModel): void {
    const generalValidationIssues: string[] = [];
    error.validationIssues.forEach(
      issue => {
        if(issue.field) {


          if (issue.field === 'contApprovalLimits') {
            this.validationIssues[issue.field] = issue.field + '_' + issue.id;
          } else {
            this.validationIssues[issue.field] = issue.message;
          }
        } else {
          generalValidationIssues.push(issue.message);
        }
      }
    );

    if(generalValidationIssues.length > 0) {
      SnackbarMessage.showGeneralErrorMessage(this.snackBar, generalValidationIssues.join(', '), 'Could not save approval limit');
    }
  }

  onChangeCurrency(newVal: CurrencyVoModel): void {
    this.approvalLimit.currency = newVal;
    delete this.validationIssues.currency;
  }

  onChangeContainerLocation(newVal: any): void{
    delete this.validationIssues.depot;
    if(!newVal) {
      delete this.approvalLimit.depot;
    } else if(newVal.depotId) {
      this.approvalLimit.depot = newVal as DepotVoModel;
    }
  }

  onLimitChange(limitValidationIssueKey: string): void {
    delete this.validationIssues[limitValidationIssueKey];
  }

  onEmailToChange(): void {
    delete this.validationIssues.emailTo;
  }

  onEmailFromChange(): void {
    delete this.validationIssues.emailFrom;
  }

  onClose(): void {
    this.unsavedChangesConfirm(this.forceClose.bind(this));
  }

  /**
   * Close without checking for unsaved changes
   */
  forceClose(): void {
    if(this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../approval-limits'], {queryParams: {}, relativeTo: this.route});
    }
  }

  private unsavedChangesConfirm(onConfirm: () => void): void {
    if(this.hasChanges()) {
      this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
        close => {
          if (close) {
            onConfirm();
          }
        }
      );
    } else {
      onConfirm();
    }
  }

  removeFromList(list: any[], i: number): void {
    list.splice(i, 1);
  }

  addToCcList(value: string): void {
    if (!this.approvalLimit.emailCc) {
      this.approvalLimit.emailCc = [];
    }

    if (value) {
      value = value.trim();
      if (value !== '' && !this.approvalLimit.emailCc.includes(value)) {
        this.approvalLimit.emailCc.push(value);
      }
    }
  }

  addToBccList(value: string): void {
    if (!this.approvalLimit.emailBcc) {
      this.approvalLimit.emailBcc = [];
    }

    if (value) {
      value = value.trim();
      if (value !== '' && !this.approvalLimit.emailBcc.includes(value)) {
        this.approvalLimit.emailBcc.push(value);
      }
    }
  }

  addToToList(value: any): void {
    if (!this.approvalLimit.emailTo) {
      this.approvalLimit.emailTo = [];
    }

    if (value) {
      value = value.trim();
      if (value !== '' && !this.approvalLimit.emailTo.includes(value)) {
        this.approvalLimit.emailTo.push(value);
      }
    }
  }
}
