// tslint:disable:max-line-length
import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {RepairJobService} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/service/repair-job.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {RepairJobModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job.model";
import {Observable} from "rxjs";
import {DepotVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/depot-vo.model";
import {TerminalVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/terminal-vo-model";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UnsavedChangesDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/unsaved-changes-dialog/unsaved-changes-dialog.component";
import {ContainerEventService} from "../../../../../../odyssey-service-library/src/lib/mandr/container-event/service/container-event.service";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {ContainerEventVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-event/model/container-event-vo.model";
import {ContainerStockVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container/model/container-stock-vo.model";
import {ValidationExceptionModel} from "../../../../../../odyssey-service-library/src/lib/model/exception/validation-exception.model";
import {SnackbarMessage} from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CurrentUserService} from "../../../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {CurrencyVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/currency-vo.model";
import {RequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/request-queue";
import {RepairItemModel} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-item.model";
import {RepairItemEditQueryParams} from "../query-params";
import {
  AlwaysShowErrorStateMatcher,
  FunctionErrorStateMatcher
} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";
import {RepairJobStatus} from "../../../../../../odyssey-service-library/src/lib/mandr/repair-job/model/repair-job-status";
import {AreYouSureDialogComponent} from "../../../../../../odyssey-shared-views/src/lib/component/dialog/are-you-sure-dialog/are-you-sure-dialog.component";
import {OdysseyLegacyService} from "../../../../../../odyssey-home/src/app/odyssey-legacy-page/odyssey-legacy-service";

@Component({
  selector: 'lib-repair-job-edit',
  templateUrl: './repair-job-edit.component.html',
  styleUrls: ['./repair-job-edit.component.scss'],
  providers: [
    SubscriptionsManager,
    DiscardingRequestQueue,
    RequestQueue
  ]
})
export class RepairJobEditComponent implements OnInit, OnChanges, AfterViewInit {

  readonly repairTypes = RepairJobModel.REPAIR_TYPES;

  @Input() disabled: boolean;
  _readonly: boolean;

  repairJobIdQuery: number | null;
  repairJobIdBinding: number | null;

  repairJob: RepairJobModel = new RepairJobModel();
  repairJobStringified?: string = JSON.stringify(this.repairJob);

  isRepairItemsApproved: boolean;

  loadingJob = false;

  latestEvent?: ContainerEventVoModel;

  validationIssues: { [field: string]: string } = {};

  expandedJob = true;
  expandedAttachments = true;
  expandedItems = false;
  expandedRemarks = false;
  errorStateMatcher = new AlwaysShowErrorStateMatcher();
  statusErrorMatcher = new FunctionErrorStateMatcher((() => !!this.validationIssues.status ).bind(this));
  companyErrorMatcher = new FunctionErrorStateMatcher((() => !!this.validationIssues.company ).bind(this));

  constructor(public userService: CurrentUserService,
              public repairJobService: RepairJobService,
              public containerEventService: ContainerEventService,
              public subscriptionManager: SubscriptionsManager,
              public containerEventRequestQueue: DiscardingRequestQueue,
              public actionRequestQueue: RequestQueue,
              public route: ActivatedRoute,
              public router: Router,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public odysseyLegacyService: OdysseyLegacyService,
              @Optional() public dialogRef: MatDialogRef<RepairJobEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {
                repairJobId: number,
                readonly: boolean,
                disabled: boolean
              }) {
    if (this.dialogData) {
      this.repairJobIdBinding = this.dialogData.repairJobId;
      this.disabled = this.dialogData.disabled;
      this.readonly = this.dialogData.readonly;
      this.loadJob();
    } else {
      const queryParam = route.snapshot.queryParams.repairJobId;
      if (queryParam) {
        this.repairJobIdQuery = queryParam;
        this.loadJob();
      }
    }
  }

  get isMainDialog(): boolean {
    // Ensure wqe are the main dialog ref, we may end up with a parent components ref
    return this.dialogRef?.componentInstance === this;
  }

  @Input() set repairJobId(id: number | null) {
    this.repairJobIdBinding = id;
  }

  /**
   * The effective job id, prioritises the ID set in data binding,
   * will fall back to the id in the query param 'repairJobId'.
   */
  get repairJobId(): number | null {
    return (this.repairJob && this.repairJob.id) ? this.repairJob.id :
        (this.repairJobIdBinding ? this.repairJobIdBinding : this.repairJobIdQuery);
  }

  get loading(): boolean {
    return this.loadingJob || this.containerEventRequestQueue.loading;
  }

  get saving(): boolean {
    return this.actionRequestQueue.loading;
  }

  get busy(): boolean {
    return this.saving || this.loading;
  }

  get canSubmit(): boolean {
    return (!!this.userService.user?.roles.MR_EDITOR || !!this.userService.user?.roles.MR_APPROVER) &&
        !!this.repairJobId && this.repairJob.status === RepairJobStatus.STATUS_DRAFT;
  }

  get canApprove(): boolean {
    return !!this.userService.user?.roles.MR_APPROVER &&
        !!this.repairJobId &&
        this.isRepairItemsApproved &&
        this.repairJob.status === RepairJobStatus.STATUS_PENDING;
  }

  get canSend(): boolean {
    return !!this.userService.user?.roles.MR_APPROVER &&
        !!this.repairJobId &&
        this.repairJob.status === RepairJobStatus.STATUS_APPROVED;
  }

  get readonly(): boolean {
    return this._readonly
        || this.route.snapshot.queryParams.mode === 'view'
        || this.repairJob.status === RepairJobStatus.STATUS_APPROVED_AND_SENT
        || this.repairJob.status === RepairJobStatus.STATUS_COMPLETE
        || this.repairJob.status === RepairJobStatus.STATUS_REJECTED
        || !(this.userService.user?.roles.MR_EDITOR || this.userService.user?.roles.MR_APPROVER);
  }

  get hasValidationIssues(): boolean {
    if (!this.repairJob) {
      return true;
    }

    if (!this.repairJob.depot && !this.repairJob.terminal) {
      return true;
    }

    if (!this.repairJob.supplier) {
      return true;
    }

    if (!this.repairJob.repairType) {
      return true;
    }

    if (!this.repairJob.currency) {
      return true;
    }

    if (!this.repairJob.containerStock) {
      return true;
    }

    return false;
  }

  get canSave(): boolean {
    return !this.busy && !this.disabled && !this.hasValidationIssues && this.hasChanges();
  }

  // tslint:disable-next-line:adjacent-overload-signatures
  @Input() set readonly(ro: boolean) {
    this._readonly = ro;
  }

  ngOnInit(): void {
    this.subscriptionManager.addSub(
        this.route.queryParams.subscribe(
            params => {
              if (!this.repairJobIdBinding) {
                const changed = this.repairJobId !== params.repairJobId;
                this.repairJobIdQuery = params.repairJobId;

                if (changed) {
                  this.loadJob();
                }
              }
            }
        )
    );
  }

  ngAfterViewInit(): void {
    if (this.isMainDialog && this.dialogRef && !this.readonly) {
      this.dialogRef.disableClose = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.repairJobId) {
      this.repairJobIdQuery = null;
      this.loadJob();
    }
  }

  hasChanges(): boolean {
    return this.repairJobStringified !== JSON.stringify(this.repairJob);
  }

  private loadJob(): void {
    if (this.repairJobId) {
      this.loadingJob = true;
      this.repairJobService.getRepairJob(this.repairJobId).subscribe(
          job => {
            this.repairJob = job;
            this.onLoadComplete();
          },
          error => {
            this.repairJob = new RepairJobModel();
            this.onLoadComplete();
          }
      );
      this.loadIsAnyRepairItemApproved();
    } else {
      this.repairJob = new RepairJobModel();
      this.onLoadComplete();
    }
  }

  loadIsAnyRepairItemApproved(): void {
    if (this.repairJobId) {
      this.actionRequestQueue.makeRequest(
          this.repairJobService.isAnyRepairItemApproved(this.repairJobId),
          result => {
            this.isRepairItemsApproved = result;
          },
          error => {
            this.isRepairItemsApproved = false;
          }
      );
    }
  }

  private loadLatestEventForLocation(): void {
    const containerNumber = this.repairJob.containerStock?.containerNumber;
    if (containerNumber) {
      let obs: Observable<ContainerEventVoModel> | null = null;
      if (this.repairJob.depot) {
        // Don't bother to load it if we already have the latest event for the depot
        if (this.latestEvent?.containerDepot && this.repairJob.depot.depotId !== this.latestEvent.containerDepot.depotId) {
          obs = this.containerEventService.getLastTurnInEventForDepot(containerNumber, this.repairJob.depot.depotId);
        }
      } else if (this.repairJob.terminal) {
        // Don't bother to load it if we already have the latest event for the terminal
        if (this.latestEvent?.terminal && this.repairJob.terminal.terminalId !== this.latestEvent.terminal.terminalId) {
          obs = this.containerEventService.getLastTurnInEventForTerminal(containerNumber, this.repairJob.terminal.terminalId);
        }
      }

      if (obs) {
        this.containerEventRequestQueue.makeRequest(
            obs,
            event => {
              this.applyEvent(event);
            },
            error => {
              delete this.latestEvent;
            }
        );
      }
    }
  }

  private loadLatestEventForContainer(): void {
    const containerNumber = this.repairJob.containerStock?.containerNumber;
    if (containerNumber) {
      this.containerEventRequestQueue.makeRequest(
          this.containerEventService.getLastTurnInEvent(containerNumber),
          event => {
            this.applyEvent(event);
            this.repairJob.terminal = event.terminal;
            this.repairJob.depot = event.containerDepot;
          },
          error => {
            delete this.latestEvent;
          }
      );
    }
  }

  private applyEvent(event: ContainerEventVoModel): void {
    this.latestEvent = event;
    this.repairJob.turnInDate = event.eventDatetime;
    this.repairJob.containerEmpty = event.emptyContainer;
  }

  private onLoadComplete(): void {
    this.repairJobStringified = JSON.stringify(this.repairJob);
    this.loadingJob = false;
  }

  save(): Observable<RepairJobModel> {
    this.validationIssues = {};
    let obs: Observable<RepairJobModel>;
    if (this.repairJobId) {
      obs = this.repairJobService.updateRepairJob(this.repairJobId, this.repairJob);
    } else {
      obs = this.repairJobService.saveRepairJob(this.repairJob);
    }

    this.actionRequestQueue.makeRequest(
        obs,
        job => {
          this.validationIssues = {};
          this.repairJobId = job.id;
          this.repairJob = job;
          this.repairJobStringified = JSON.stringify(this.repairJob);
        },
        error => {
          if (ValidationExceptionModel.isValidationException(error.error)) {
            this.handleValidationIssues(error.error as ValidationExceptionModel, 'Could not save repair job');
          } else {
            SnackbarMessage.showErrorMessage(this.snackBar, error, 'Could not save repair job');
          }
        }
    );

    return obs;
  }

  private handleValidationIssues(error: ValidationExceptionModel, message: string): void {
    const generalValidationIssues: string[] = [];
    error.validationIssues.forEach(
        issue => {
          if (issue.field) {
            this.validationIssues[issue.field] = issue.message;
          } else {
            generalValidationIssues.push(issue.message);
          }
        }
    );

    if (generalValidationIssues.length > 0) {
      SnackbarMessage.showGeneralErrorMessage(this.snackBar, generalValidationIssues.join(', '), message);
    }
  }

  onChangeRepairType(): void {
    delete this.validationIssues.repairType;
  }

  onChangeContainerLocation(newVal: any): void {
    if (!newVal) {
      delete this.repairJob.terminal;
      delete this.repairJob.depot;
    } else if (newVal.depotId) {
      delete this.repairJob.terminal;
      this.repairJob.depot = newVal as DepotVoModel;
      this.loadLatestEventForLocation();
    } else {
      this.repairJob.terminal = newVal as TerminalVoModel;
      delete this.repairJob.depot;
      this.loadLatestEventForLocation();
    }

    delete this.validationIssues.depot;
    delete this.validationIssues.terminal;
  }

  onChangeSupplier(newVal: any): void {
    if (!newVal) {
      delete this.repairJob.supplier;
    } else if (newVal.depotId) {
      delete this.validationIssues.supplier;
      this.repairJob.supplier = newVal as DepotVoModel;
    } else {
      delete this.validationIssues.supplier;
      delete this.repairJob.supplier;
      throw new Error("Incorrect location type for supplier");
    }
    delete this.validationIssues.supplier;
  }

  onChangeCurrency(newVal: any): void {
    this.repairJob.currency = newVal as CurrencyVoModel;
    delete this.validationIssues.currency;
  }

  onClose(): void {
    this.unsavedChangesConfirm(this.forceClose.bind(this));
  }

  /**
   * Close without checking for unsaved changes.
   * @private
   */
  forceClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../repair-job'], {queryParams: {}, relativeTo: this.route});
    }
  }

  onUndoChanges(): void {
    this.unsavedChangesConfirm(() => {
      const stringified = this.repairJobStringified;
      if (stringified) {
        this.repairJob = Object.assign(new RepairJobModel(), JSON.parse(stringified));
      } else {
        this.repairJob = new RepairJobModel();
      }
    });
  }

  onContainerChanged(newContainer: ContainerStockVoModel): void {
    if (newContainer) {
      this.loadLatestEventForContainer();
    }
    delete this.validationIssues.containerStock;
  }

  submitRepairJob(): void {
    if (this.repairJobId) {
      this.validationIssues = {}; // reset
      const obs = !this.hasChanges() ? this.repairJobService.submitRepairJob(this.repairJobId) : this.repairJobService.saveAndSubmitRepairJob(this.repairJobId, this.repairJob);
      this.handleResponseOrShowErrors(obs, 'Could not submit repair job for approval');
    }
  }

  approveRepairJob(): void {
    this.dialog.open(AreYouSureDialogComponent, {data: {message: `Are you sure you want to approve this Repair Job to ${this.repairJob.supplier ? this.repairJob.supplier?.nameShort : this.repairJob.terminal?.nameShort}?`}}).afterClosed().subscribe(
        yes => {
          if (yes) {
            if (this.repairJobId) {
              this.validationIssues = {}; // reset
              const obs = !this.hasChanges() ? this.repairJobService.approveRepairJob(this.repairJobId) : this.repairJobService.saveAndApproveRepairJob(this.repairJobId, this.repairJob);
              this.handleResponseOrShowErrors(obs, 'Could not approve repair job');
            }
          }
        }
    );
  }

  sendRepairJob(): void {
    this.dialog.open(AreYouSureDialogComponent, {data: {message: `Are you sure you want to send this Repair Job to ${this.repairJob.supplier ? this.repairJob.supplier?.nameShort : this.repairJob.terminal?.nameShort}?`}}).afterClosed().subscribe(
        yes => {
          if (yes) {
            if (this.repairJobId) {
              this.validationIssues = {};
              const obs = !this.hasChanges() ? this.repairJobService.sendRepairJob(this.repairJobId) : this.repairJobService.saveAndSendRepairJob(this.repairJobId, this.repairJob);
              this.handleResponseOrShowErrors(obs, 'Could not send repair job');
            }
          }
        }
    );
  }

  private handleResponseOrShowErrors(obs: Observable<RepairJobModel>, message: string): void {
    this.actionRequestQueue.makeRequest(
        obs,
        job => {
          this.repairJob = job;
          this.repairJobStringified = JSON.stringify(this.repairJob);
        },
        error => {
          if (ValidationExceptionModel.isValidationException(error.error)) {
            this.handleValidationIssues(error.error as ValidationExceptionModel, message);
          } else {
            SnackbarMessage.showErrorMessage(this.snackBar, error, message);
          }
        }
    );
  }

  private unsavedChangesConfirm(onDiscardChanges: () => void): void {
    if (!this.hasChanges()) {
      onDiscardChanges();
    } else {
      this.dialog.open(UnsavedChangesDialogComponent).afterClosed().subscribe(
          close => {
            if (close) {
              onDiscardChanges();
            }
          }
      );
    }
  }

  onRepairItemEditClick(item: RepairItemModel): void {
    this.unsavedChangesConfirm(() => {
      this.openItemViewEditPage(true, item.id);
    });
  }

  onRepairItemAddClick(): void {
    this.unsavedChangesConfirm(() => {
      this.openItemViewEditPage(true);
    });
  }

  onRepairItemViewClick(item: RepairItemModel): void {
    this.unsavedChangesConfirm(() => {
      this.openItemViewEditPage(false, item.id);
    });
  }

  private openItemViewEditPage(edit: boolean, itemId?: number): void {
    const queryParams = new RepairItemEditQueryParams();
    queryParams.mode = edit ? 'edit' : 'view';
    queryParams.parentMode = this.route.snapshot.queryParams.mode;
    queryParams.repairJobId = this.repairJob.id;
    queryParams.repairItemId = itemId;
    this.router.navigate(['../repair-item-edit'], {queryParams, relativeTo: this.route});
  }

  get canCreateRequestInspectionJob(): boolean {
    return !!this.repairJobId &&
        this.repairJob.status !== RepairJobStatus.STATUS_COMPLETE &&
        this.repairJob.status !== RepairJobStatus.STATUS_REJECTED;
  }

  createRequestInspectionJob(): void {
    if (!this.repairJobId) {
      return;
    }

    if (this.hasChanges()) {
      // any changes must be saved first. showing dialog so user is aware
      this.dialog.open(AreYouSureDialogComponent, {data: {message: `This action will save any unsaved changes on this Repair Job.`}}).afterClosed().subscribe(yes => {
        if (yes) {
          const obs = this.save();
          obs.subscribe(_ => {
            // now create the inspection job and redirect
            this.redirectAndSetInspectionJob();
          });
        }
      });
    } else {
      this.redirectAndSetInspectionJob();
    }
  }

  redirectAndSetInspectionJob(): void {
    this.odysseyLegacyService.changeMenuMsg({
      action: "redirect-and-set-vendor-job",
      payload: {repairJobId: this.repairJob.id}
    });
  }
}
