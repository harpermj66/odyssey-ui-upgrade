import {Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional} from "@angular/core";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ContainerJobTariffModel} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/model/container-job-tariff.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ContainerJobTariffService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-tariff.service";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {ContTypeGroupService} from "../../../../../../odyssey-service-library/src/lib/mandr/cont-type-group/service/cont-type-group.service";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {DepotVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/model/depot-vo.model";
import {ContainerLocationVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/model/container-location-vo.model";
import {flatMap, Observable, of, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ContainerCategoriesService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-categories.service";
import {CurrencyVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/currency-vo.model";
import {
  FunctionErrorStateMatcher
} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

export class ContainerJobTariffEditQueryParams {
  mode?: 'view' | 'edit' = 'view';
  containerJobTariffId?: string;
}

class DecimalInputErrorStateMatcher extends ErrorStateMatcher {
  constructor(private component: ContainerJobTariffEditComponent, private group: string, private input: HTMLInputElement) {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const amounts = this.component.containerJobTariff?.amounts;
    let error = false;
    if(amounts) {
      const amount = amounts[this.group];
      error = this.component.hasValue(amount) && (!this.component.isNumber(amount) || this.component.isNegative(amount));
    }

    if(this.input?.validity) {
      error = error ||
        this.input.validity.badInput ||
        this.input.validity.customError ||
        this.input.validity.rangeOverflow ||
        this.input.validity.rangeUnderflow;
    }

    return error;
  }
}

@Component({
  selector: 'lib-container-job-tariff-edit',
  templateUrl: './container-job-tariff-edit.component.html',
  styleUrls: ['./container-job-tariff-edit.component.scss'],
  providers: [
    DiscardingRequestQueue,
    SubscriptionsManager
  ]
})
export class ContainerJobTariffEditComponent implements OnInit, OnDestroy {

  @Input() disabled: boolean;
  _readonly: boolean;

  containerJobTariffIdQuery: string | null;
  containerJobTariffIdBinding: string | null;

  containerJobTariff: ContainerJobTariffModel = new ContainerJobTariffModel();
  containerJobTariffStringified: string = JSON.stringify(this.containerJobTariff);

  containerCategories: string[] = [];
  contTypeGroups: string[] = [];
  readonly labourRateGroups: string[] = ['Dry', 'Reefer', 'Reefer Machinery'];

  actionRequestQueue = new RequestQueue();

  validationIssues: {[field: string]: string} = {};

  validFromErrorMatcher = new FunctionErrorStateMatcher(this.validFromInvalid.bind(this));
  validToErrorMatcher = new FunctionErrorStateMatcher(this.validToInvalid.bind(this));
  emptyErrorMatcher = new FunctionErrorStateMatcher(this.emptyInvalid.bind(this));
  hazardousErrorMatcher = new FunctionErrorStateMatcher(this.hazardousInvalid.bind(this));

  decimalInputErrorMatchers: {[group: string]: DecimalInputErrorStateMatcher} = {};

  private roundDecimalsTimeout: {[group: string]: number} = {};

  constructor(private loadingQueue: DiscardingRequestQueue,
              private subscriptionsManager: SubscriptionsManager,
              private route: ActivatedRoute,
              private router: Router,
              private userService: CurrentUserService,
              private containerJobTariffService: ContainerJobTariffService,
              private containerCategoryService: ContainerCategoriesService,
              private contTypeGroupsService: ContTypeGroupService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
              @Optional() private dialogRef: MatDialogRef<ContainerJobTariffEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {
                containerJobTariffId: string,
                readonly: boolean,
                disabled: boolean
  }) {
    if(this.dialogData) {
      this.containerJobTariffId = this.dialogData.containerJobTariffId;
      this.disabled = this.dialogData.disabled;
      this.readonly = this.dialogData.readonly;
      this.loadTariff();
    } else {
      const queryParam = route.snapshot.queryParams.containerJobTariffId;
      if(queryParam) {
        this.containerJobTariffIdQuery = queryParam;
      }
      this.loadTariff();
    }

    this.subscriptionsManager.addDestroyable(this.actionRequestQueue);
  }

  ngOnInit(): void {
    this.subscriptionsManager.addSub(
      this.route.queryParams.subscribe(
        params => {
          if(!this.containerJobTariffIdBinding) {
            const changed = this.containerJobTariffId !== params.containerJobTariffId;
            this.containerJobTariffIdQuery = params.containerJobTariffId;

            if(changed) {
              this.loadTariff();
            }
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    for(const group of Object.getOwnPropertyNames(this.roundDecimalsTimeout)) {
      const timeout = this.roundDecimalsTimeout[group];
      if(timeout) {
        clearTimeout(timeout);
      }
    }
  }

  get isMainDialog(): boolean {
    // Ensure we are the main dialog ref, we may end up with a parent components ref
    return this.dialogRef?.componentInstance === this;
  }

  @Input() set containerJobTariffId(id: string | null) {
    this.containerJobTariffIdBinding = id;
  }

  /**
   * The effective id, prioritises the ID set in data binding,
   * will fall back to the id in the query param 'containerJobTariffId'.
   */
  get containerJobTariffId(): string | null {
    return (this.containerJobTariff && this.containerJobTariff.id) ? this.containerJobTariff.id :
      (this.containerJobTariffIdBinding ? this.containerJobTariffIdBinding : this.containerJobTariffIdQuery);
  }

  get loading(): boolean {
    return this.loadingQueue.loading;
  }

  get saving(): boolean {
    return this.actionRequestQueue.loading;
  }

  get busy(): boolean {
    return this.saving || this.loading;
  }

  get readonly(): boolean {
    return this._readonly
      || this.route.snapshot.queryParams.mode === 'view'
      || !(this.userService.user?.roles.VENDOR_JOB_APPROVER || this.userService.user?.roles.VENDOR_JOB_EDITOR);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  get amountGroups(): string[] {
    return this.containerJobTariff.jobType === 'LABOUR_RATE' ? this.labourRateGroups : this.contTypeGroups;
  }

  get canSave(): boolean {
    return !this.busy && !this.disabled && !this.hasValidationIssues && this.hasChanges();
  }

  get hasValidationIssues(): boolean {
    if(!this.containerJobTariff) {
      return true;
    }

    if(!this.containerJobTariff.jobType) {
      return true;
    }

    if(!this.containerJobTariff.containerCategories || this.containerJobTariff.containerCategories.length === 0) {
      return true;
    }

    if(!this.containerJobTariff.validFrom) {
      return true;
    }

    if(!this.containerJobTariff.validTo) {
      return true;
    }

    if(!this.containerJobTariff.depotId) {
      return true;
    }

    if(!this.containerJobTariff.currencyId) {
      return true;
    }

    if(!this.containerJobTariff.hazardous) {
      return true;
    }

    if(!this.containerJobTariff.empty) {
      return true;
    }

    if(this.containerJobTariff.amounts) {
      for(const group of Object.getOwnPropertyNames(this.containerJobTariff.amounts)) {
        const amount = this.decimalInputErrorMatchers[group];
        if(amount.isErrorState(null,null)) {
          return true;
        }
      }
    }

    return false;
  }

  validFromInvalid(): boolean {
    return !this.containerJobTariff.validFrom || !!this.validationIssues.validFrom;
  }

  validToInvalid(): boolean {
    return !this.containerJobTariff.validTo || !!this.validationIssues.validTo;
  }

  emptyInvalid(): boolean {
    return !this.containerJobTariff.empty || !!this.validationIssues.empty;
  }

  hazardousInvalid(): boolean {
    return !this.containerJobTariff.hazardous || !!this.validationIssues.hazardous;
  }

  private loadTariff(): void {
    const id = this.containerJobTariffId;
    if(id) {
      this.loadOldTariff(id);
    } else {
      this.loadNewTariff();
    }
  }

  /**
   * Load a previously created tariff from the server.
   * @private
   */
  private loadOldTariff(id: string): void {
    this.loadingQueue.makeRequest(
      // Load the container type groups then load the tariff
      this.loadContGroupsAndCategories().pipe(
        flatMap(
          contTypeGroups => this.containerJobTariffService.getTariff(id)
        )
      ),
      tariff => {
        this.containerJobTariff = tariff;
        this.containerJobTariffStringified = JSON.stringify(this.containerJobTariff);
      },
      error => {
        if(!error.handled) {
          SnackbarMessage.showErrorMessage(this.snackbar, error,'Could not load Vendor Job Tariff');
        }
      }
    );
  }

  /**
   * Load the data required to set the default fields in a new tariff.
   * @private
   */
  private loadNewTariff(): void {
    this.loadingQueue.makeRequest(
      this.loadContGroupsAndCategories(),
      () => {
        this.containerJobTariff = new ContainerJobTariffModel();
        this.decimalInputErrorMatchers = {};
        // Default to all categories.
        this.containerJobTariff.containerCategories = this.containerCategories;
        this.containerJobTariffStringified = JSON.stringify(this.containerJobTariff);
      },
      error => {
        if(!error.handled) {
          SnackbarMessage.showErrorMessage(this.snackbar, error,'Could not load Vendor Job Tariff');
        }
      }
    );
  }

  /**
   * Loads the container groups and categories from the server.
   * @private
   */
  private loadContGroupsAndCategories(): Observable<string[]> {
    return this.loadContCategories().pipe(
      flatMap(
        contTypeGroups => this.loadContTypeGroups()
      )
    );
  }

  /**
   * Load the container type groups from the server.
   * @private
   */
  private loadContTypeGroups(): Observable<string[]> {
    return !this.contTypeGroups || this.contTypeGroups.length === 0 ? this.contTypeGroupsService.getContTypeGroupsByType(ContTypeGroupService.GROUP_TYPE_CONTAINER)
      .pipe(
        map(
          contTypeGroups => {
            this.contTypeGroups = contTypeGroups.map(a => a.groupName);
            return this.contTypeGroups;
          }
        ),
        catchError(
          error => {
            error.handled = true;
            SnackbarMessage.showErrorMessage(this.snackbar, error,'Could not load Container Type Groups');
            return throwError(error);
          }
        )
    ) : of(this.contTypeGroups);
  }

  /**
   * Load the container categories from the server.
   * @private
   */
  private loadContCategories(): Observable<string[]> {
    return !this.containerCategories || this.containerCategories.length === 0 ? this.containerCategoryService.getCategories().pipe(
      map(
        categories => {
          this.containerCategories = categories;
          return this.containerCategories;
        }
      ),
      catchError(
        error => {
          error.handled = true;
          SnackbarMessage.showErrorMessage(this.snackbar, error,'Could not load Container Categories');
          return throwError(error);
        }
      )
    ) : of(this.containerCategories);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.containerJobTariff) !== this.containerJobTariffStringified;
  }

  saveTariff(): void {
    const tariff = this.containerJobTariff;
    if(tariff) {
      this.validationIssues = {};
      this.actionRequestQueue.makeRequest(
        this.containerJobTariffService.createOrUpdateTariff(tariff),
        updatedTariff => {
          this.decimalInputErrorMatchers = {};
          this.containerJobTariff = updatedTariff;
          this.containerJobTariffStringified = JSON.stringify(this.containerJobTariff);
        },
        error => {
          if(ValidationExceptionModel.isValidationException(error.error)) {
            this.handleValidationIssues(error.error as ValidationExceptionModel, 'Could not save Vendor Job Tariff');
          } else {
            SnackbarMessage.showErrorMessage(this.snackbar, error,'Could not save Vendor Job Tariff');
          }
        }
      );
    }
  }

  private handleValidationIssues(error: ValidationExceptionModel, message: string): void {
    const generalValidationIssues: string[] = [];
    error.validationIssues.forEach(
      issue => {
        if(issue.field) {
          this.validationIssues[issue.field] = issue.message;
        } else {
          generalValidationIssues.push(issue.message);
        }
      }
    );

    if(generalValidationIssues.length > 0) {
      SnackbarMessage.showGeneralErrorMessage(this.snackbar, generalValidationIssues.join(', '), message);
    }
  }


  onClose(): void {
    if(!this.hasChanges()) {
      this.forceClose();
    } else {
      this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
        close => {
          if(close) {
            this.forceClose();
          }
        }
      );
    }
  }

  /**
   * Close without checking for unsaved changes.
   * @private
   */
  private forceClose(): void {
    if(this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../tariff-list'], {queryParams: {}, relativeTo: this.route});
    }
  }

  onUndoChanges(): void {
    this.loadTariff();
  }

  onChangeDepot(event?: ContainerLocationVoModel | null): void {
    if(event) {
      this.containerJobTariff.depotId = (event as DepotVoModel).depotId;
      this.containerJobTariff.depotName = (event as DepotVoModel).nameShort;
    } else {
      delete this.containerJobTariff.depotId;
      delete this.containerJobTariff.depotName;
    }
    delete this.validationIssues.depotId;
    delete this.validationIssues.depotName;
  }

  onCurrencyChange(event: CurrencyVoModel | null): void {
    if(event) {
      this.containerJobTariff.currencyId = event.currencyId;
      this.containerJobTariff.currencyShort = event.shortname;
    } else {
      delete this.containerJobTariff.currencyId;
      delete this.containerJobTariff.currencyShort;
    }
    delete this.validationIssues.currencyId;
    delete this.validationIssues.currencyShort;
  }

  onJobTypeChange(): void {
    delete this.validationIssues.jobType;
  }

  onValidFromChange(): void {
    delete this.validationIssues.validFrom;
  }

  onValidToChange(): void {
    delete this.validationIssues.validTo;
  }

  onEmptyChange(): void {
    delete this.validationIssues.empty;
  }

  onHazardousChange(): void {
    delete this.validationIssues.hazardous;
  }

  onContCategoriesChange(): void {
    delete this.validationIssues.containerCategories;
  }

  getErrorMatcher(group: string, input: HTMLInputElement): ErrorStateMatcher {
    let matcher = this.decimalInputErrorMatchers[group];
    if(!matcher) {
      matcher = new DecimalInputErrorStateMatcher(this, group, input);
      this.decimalInputErrorMatchers[group] = matcher;
    }
    return matcher;
  }

  isNegative(amount: number | string | undefined | null): boolean {
    let isNeg = false;
    if(amount !== undefined && amount !== null && this.isNumber(amount)) {
      const val = parseFloat(amount.toString());
      isNeg = val < 0;
    }
    return isNeg;
  }

  isNumber(amount: number | string | undefined | null): boolean {
    return amount !== undefined && amount !== null && !isNaN(parseFloat(amount.toString()));
  }

  hasValue(amount: any): boolean {
    return amount !== undefined && amount !== null;
  }

  checkInputValidity(group: string, element: HTMLInputElement): void {
    if(element.value && typeof element.value === 'string') {
      const parts: string[] = element.value.split('');
      let valid = true;
      let hasDecimal = false;
      for(const part of parts) {
        if(!this.isNumber(part)) {
          if(part === '.') {
            if(!hasDecimal) {
              hasDecimal = true;
            } else {
              valid = false;
              break;
            }
          } else {
            valid = false;
            break;
          }
        }
      }

      if(!valid) {
        element.setCustomValidity('Invalid format');
      } else {
        element.setCustomValidity('');
      }
    }

    if(this.roundDecimalsTimeout[group]) {
      clearTimeout(this.roundDecimalsTimeout[group]);
    }

    this.roundDecimalsTimeout[group] = setTimeout(() => {
      if(!element.validity.customError && !element.validity.badInput) {
        element.value = parseFloat(element.value).toFixed(2).toString();
      }
    }, 1000);
  }
}
