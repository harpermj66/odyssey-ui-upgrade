import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RepairItemModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-item.model";
import {Observable} from "rxjs";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {RepairItemService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-item.service";
import {CedexCodeModel} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/model/cedex-code.model";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {RepairJobModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job.model";
import {RepairJobService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job.service";
import {RepairJobEditQueryParams} from "../query-params";
import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

export class HeightErrorMatcher extends ErrorStateMatcher {
  constructor(private component: RepairItemEditComponent) {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!this.component.validationIssues.damageHeight ||
      (!!this.component.repairItem.damageWidth && !this.component.repairItem.damageHeight);
  }
}

export class WidthErrorMatcher extends ErrorStateMatcher {
  constructor(private component: RepairItemEditComponent) {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!this.component.validationIssues.damageWidth ||
      (!!this.component.repairItem.damageHeight && !this.component.repairItem.damageWidth);
  }
}


@Component({
  selector: 'lib-repair-item-edit',
  templateUrl: './repair-item-edit.component.html',
  styleUrls: ['./repair-item-edit.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class RepairItemEditComponent implements OnInit, OnChanges, AfterViewInit {
  readonly cedexTypeComponent = CedexCodeModel.TYPE_COMPONENT;
  readonly cedexTypeLocation = CedexCodeModel.TYPE_LOCATION;
  readonly cedexTypeDamage = CedexCodeModel.TYPE_DAMAGE;
  readonly cedexTypeRepair = CedexCodeModel.TYPE_REPAIR;

  @Input() disabled: boolean;
  _readonly: boolean;

  repairItemIdQuery: number | null;
  repairItemIdBinding: number | null;

  repairJobIdQuery: number | null;
  repairJobIdBinding: number | null;

  repairItem: RepairItemModel = new RepairItemModel();
  repairItemStringified?: string;
  repairJob: RepairJobModel;

  loadingItem = false;
  loadingJob = false;
  saving = false;

  validationIssues: {[field: string]: string} = {};

  errorMatcherHeight = new HeightErrorMatcher(this);
  errorMatcherWidth = new WidthErrorMatcher(this);

  constructor(private userService: CurrentUserService,
              private repairItemService: RepairItemService,
              private repairJobService: RepairJobService,
              private subscriptionManager: SubscriptionsManager,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              @Optional() public dialogRef: MatDialogRef<RepairItemEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {
                repairItemId: number,
                repairJobId: number,
                readonly: boolean,
                disabled: boolean
              }) {
    if(this.dialogData) {
      this.repairItemIdBinding = this.dialogData.repairItemId;
      this.repairJobIdBinding = this.dialogData.repairJobId;
      this.disabled = this.dialogData.disabled;
      this.readonly = this.dialogData.readonly;
      this.load();
    } else {
      const jobId = route.snapshot.queryParams.repairJobId;
      if(jobId) {
        this.repairJobIdQuery = jobId;
      }

      const itemId = route.snapshot.queryParams.repairItemId;
      if(itemId) {
        this.repairItemIdQuery = itemId;
      }

      this.load();
    }
  }

  get isMainDialog(): boolean {
    // Ensure wqe are the main dialog ref, we may end up with a parent components ref
    return this.dialogRef?.componentInstance === this;
  }

  get readonly(): boolean {
    return this._readonly
      || this.route.snapshot.queryParams.mode === 'view'
      || !(this.userService.user?.roles.MR_EDITOR || this.userService.user?.roles.MR_APPROVER);
  }

  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  @Input() set repairItemId(id: number | null) {
    this.repairItemIdBinding = id;
  }

  /**
   * The effective job id, prioritises the ID set in data binding,
   * will fall back to the id in the query param 'repairJobId'.
   */
  get repairItemId(): number | null {
    return (this.repairItem && this.repairItem.id) ? this.repairItem.id : (this.repairItemIdBinding ? this.repairItemIdBinding : this.repairItemIdQuery);
  }

  @Input() set repairJobId(id: number | null) {
    this.repairJobIdBinding = id;
  }

  /**
   * The effective job id, prioritises the ID set in data binding,
   * will fall back to the id in the query param 'repairJobId'.
   */
  get repairJobId(): number | null {
    return this.repairJobIdBinding ? this.repairJobIdBinding : this.repairJobIdQuery;
  }

  get loading(): boolean {
    return this.loadingItem;
  }

  get busy(): boolean {
    return this.saving || this.loading;
  }

  get canSave(): boolean {
    return !this.busy && !this.disabled && !this.hasValidationIssues && this.hasChanges();
  }

  get hasValidationIssues(): boolean {
    if(!this.repairItem) {
      return true;
    }

    if(!this.repairItem.damageWidth && this.repairItem.damageHeight) {
      return true;
    }

    if(this.repairItem.damageWidth && !this.repairItem.damageHeight) {
      return true;
    }

    if(this.repairItem.damageWidth && this.repairItem.damageWidth < 0) {
      return true;
    }

    if(this.repairItem.damageHeight && this.repairItem.damageHeight < 0) {
      return true;
    }

    return false;
  }

  ngOnInit(): void {
    this.subscriptionManager.addSub(
      this.route.queryParams.subscribe(
        params => {
          let changed = false;
          if(!this.repairItemIdBinding) {
            changed = this.repairItemId !== params.repairItemId;
            this.repairItemIdQuery = params.repairItemId;
          }

          if(!this.repairJobIdBinding) {
            changed = changed || this.repairJobId !== params.repairJobId;
            this.repairJobIdQuery = params.repairJobId;
          }

          if(changed) {
            this.load();
          }
        }
      )
    );
  }

  ngAfterViewInit(): void {
    if(this.isMainDialog && this.dialogRef && !this.readonly) {
      this.dialogRef.disableClose = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.repairItemId) {
      this.repairItemIdQuery = null;
      this.load();
    }
  }

  hasChanges(): boolean {
    return this.repairItemStringified !== JSON.stringify(this.repairItem);
  }

  private load(): void {
    if(this.repairJobId) {
      this.loadingJob = true;
      this.repairJobService.getRepairJob(this.repairJobId).subscribe(
        job => {
          this.repairJob = job;
          this.loadingJob = false;
          this.loadRepairItem();
        },
        error => {
          this.loadingJob = false;
          SnackbarMessage.showErrorMessage(this.snackBar, error,'Could not load repair job');
        }
      );
    }
  }

  private loadRepairItem(): void {
    if(this.repairItemId) {
      this.loadingItem = true;
      this.repairItemService.getRepairItem(this.repairItemId).subscribe(
        item => {
          this.repairItem = item;
          this.onLoadComplete();
        },
        error => {
          this.loadingItem = false;
          SnackbarMessage.showErrorMessage(this.snackBar, error,'Could not load repair item');
        }
      );
    } else {
      this.repairItem = new RepairItemModel();
      this.onLoadComplete();
    }
  }

  private onLoadComplete(): void {
    this.repairItemStringified = JSON.stringify(this.repairItem);
    this.loadingJob = false;
    this.loadingItem = false;
  }

  save(): void {
    this.validationIssues = {};
    let obs: Observable<RepairItemModel> | null = null;

    const repairItemId = this.repairItemId;
    const repairJobId = this.repairJobId;
    if(repairItemId) {
      obs = this.repairItemService.updateRepairItem(repairItemId, this.repairItem);
    } else if(repairJobId) {
      obs = this.repairItemService.addRepairItemToRepairJob(repairJobId, this.repairItem);
    } else {
      console.error('No repair job id specified');
    }

    if(obs) {
      this.saving = true;
      obs.subscribe(
        item => {
          this.repairItemId = item.id;
          this.repairItem = item;
          this.repairItemStringified = JSON.stringify(this.repairItem);
          this.saving = false;
        },
        error => {
          this.saving = false;
          if(ValidationExceptionModel.isValidationException(error.error)) {
            this.handleValidationIssues(error.error as ValidationExceptionModel);
          } else {
            SnackbarMessage.showErrorMessage(this.snackBar, error,'Could not save repair item');
          }
        }
      );
    }
  }

  private handleValidationIssues(error: ValidationExceptionModel): void {
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
      SnackbarMessage.showGeneralErrorMessage(this.snackBar, generalValidationIssues.join(', '), 'Could not save repair item');
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
  forceClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      const queryParams = new RepairJobEditQueryParams();
      queryParams.repairJobId = this.repairJobId;
      queryParams.mode = this.route.snapshot.queryParams.parentMode;
      this.router.navigate(['../repair-job-edit'], {queryParams, relativeTo: this.route});
    }
  }

  onDamageHeightChange(): void {
    delete this.validationIssues.damageHeight;
  }

  onDamageWidthChange(): void {
    delete this.validationIssues.damageWidth;
  }
}
