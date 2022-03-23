import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserRegistrationService} from "../service/user-registration/user-registration.service";
import {CompanyLookupRemoteService} from "../service/company-lookup/company-lookup-remote.service";
import {CarrierRemoteService} from "../service/carrier/carrier-remote.service";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {Router} from "@angular/router";
import {PasswordValidation} from "../util/validation/password-validation";
import {getBooleanFromUserStatus, getUserStatusByBoolean, User} from "../model/user";
import {CompanyRemoteService} from "../service/company/company-remote.service";
import {Preferences} from "../model/preferences";
import {PermissionGroupRemoteService} from "../service/permission-group/permission-group-remote.service";
import {PermissionGroup} from "../model/permission-group";
import {UserCreationRemoteService} from "../service/user-creation/user-creation-remote.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Language} from "../model/language";
import {LanguageRemoteService} from "../service/language/language-remote.service";
import {TimeZoneRemoteService} from "../service/time-zone/time-zone-remote.service";
import {TimeZone} from "../model/time-zone";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import { SnackbarMessage } from "../../../../odyssey-service-library/src/lib/utils/snackbar-message";

@Component({
  selector: 'lib-user-creation-page',
  templateUrl: './user-creation-page.component.html',
  styleUrls: ['./user-creation-page.component.css']
})
export class UserCreationPageComponent implements OnInit, OnDestroy {

  @Output() userCreationCancelled = new EventEmitter<void>();

  @Input() userToEdit?: User;

  userCreationForm: FormGroup;
  currentUser: CurrentUser;
  currentCompanyId: number;
  newUser = new User();
  permissionGroups: PermissionGroup[] = [];
  selectedPermissionGroups: PermissionGroup[] = [];
  languages: Language[] = [];
  timeZones: TimeZone[] = [];
  loading = false;
  awaitingResponse = false;


  constructor(
      private _formBuilder: FormBuilder,
      private _userRegistrationService: UserRegistrationService,
      private _companyLookupRemoteService: CompanyLookupRemoteService,
      private _companyRemoteService: CompanyRemoteService,
      private _carrierRemoteService: CarrierRemoteService,
      private _userCreationRemoteService: UserCreationRemoteService,
      private _permissionGroupRemoteService: PermissionGroupRemoteService,
      private _languageRemoteService: LanguageRemoteService,
      private _timeZoneRemoteService: TimeZoneRemoteService,
      private _router: Router,
      private _userService: CurrentUserService,
      private _snackBar: MatSnackBar,
      private _dialog: MatDialog,
  ) {
    this.currentUser = this._userService.user!!;
    this.currentCompanyId = this.currentUser.company?.companyId!!;

    this._companyRemoteService.findCompanyById(this.currentCompanyId).subscribe(
        res => {
          this.newUser.company = res;
          this.updateLoadingState();
        },
        error => {
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, "Unable to retrieve current user's company.");
          this.loading = false;
          throw Error("Failed to retrieve current user's company.");
        }
    );

    this._permissionGroupRemoteService.findPermissionGroupsByCompanyId(this.currentCompanyId).subscribe(
        res => {
          this.permissionGroups = res;

            this.permissionGroups.forEach(group => {
                this.selectedPermissionGroups.forEach(selectedGroup => {
                    if(group.name === selectedGroup.name){
                        group.checked = true;
                    }
                });
            });

          this.updateLoadingState();
        },
        error => {
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, "Failed to retrieve permission groups.");
          this.loading = false;
          throw Error("Failed to retrieve permission groups.");
        }
    );

    this.getLanguages();
    this.getTimeZones();
  }

  ngOnInit(): void {
    this.userCreationForm = this._formBuilder.group({
      personalDetailsGroup: this._formBuilder.group({
        title: [this.userToEdit ? this.userToEdit.title : ''],
        firstName: [this.userToEdit ? this.userToEdit.firstName : '', Validators.required],
        lastName: [this.userToEdit ? this.userToEdit.lastName : '', Validators.required],
        jobTitle: [this.userToEdit ? this.userToEdit.jobTitle : ''],
        email: [this.userToEdit ? this.userToEdit.email : '', Validators.email],
        password: ['',
          [
            Validators.minLength(this.userToEdit ? 0 : PasswordValidation.MIN_LENGTH),
            Validators.maxLength(PasswordValidation.MAX_LENGTH),
          ]
        ],
        passwordRepeat: ['',
          this.userToEdit ?
              [
                PasswordValidation.matchPassword
              ]
              :
              [
                  Validators.required,
                  PasswordValidation.matchPassword
              ]
        ],
        active: [this.userToEdit ? getBooleanFromUserStatus(this.userToEdit.status) : true]
      }),
      contactDetailsGroup: this._formBuilder.group({
        workPhoneNumber: [this.userToEdit ? this.userToEdit.workPhoneNumber : ''],
        workFaxNumber: [this.userToEdit ? this.userToEdit.workFaxNumber : ''],
        workMobileNumber: [this.userToEdit ? this.userToEdit.workMobileNumber : ''],
      }),
      preferencesGroup: this._formBuilder.group({
        language: [this.userToEdit ? this.userToEdit.language : ''],
        timeZone: [this.userToEdit ? this.userToEdit.timeZone : ''],
      }),
    });

    this.userToEdit && this.selectedPermissionGroups.push(...this.userToEdit.permissionGroups);
  }

  ngOnDestroy(): void {
    this.userToEdit = undefined;
  }

  handlePermissionGroupSelection(event: MatCheckboxChange, permissionGroup: PermissionGroup): void {
    if(event.checked){
      this.selectedPermissionGroups.push(permissionGroup);
    } else {
      const index = this.selectedPermissionGroups.indexOf(permissionGroup);
      this.selectedPermissionGroups.splice(index, 1);
    }
  }

  submitForm(): void {
    this.awaitingResponse = true;

    this.newUser.title = this.userCreationForm.controls.personalDetailsGroup.get("title")?.value;
    this.newUser.firstName = this.userCreationForm.controls.personalDetailsGroup.get("firstName")?.value;
    this.newUser.lastName = this.userCreationForm.controls.personalDetailsGroup.get("lastName")?.value;
    this.newUser.jobTitle = this.userCreationForm.controls.personalDetailsGroup.get("jobTitle")?.value;
    this.newUser.email = this.userCreationForm.controls.personalDetailsGroup.get("email")?.value;
    this.newUser.password = this.userCreationForm.controls.personalDetailsGroup.get("password")?.value;
    this.newUser.workPhoneNumber = this.userCreationForm.controls.contactDetailsGroup.get("workPhoneNumber")?.value;
    this.newUser.workMobileNumber = this.userCreationForm.controls.contactDetailsGroup.get("workMobileNumber")?.value;
    this.newUser.workFaxNumber = this.userCreationForm.controls.contactDetailsGroup.get("workFaxNumber")?.value;
    this.newUser.language = this.userCreationForm.controls.preferencesGroup.get("language")?.value;
    this.newUser.timeZone = this.userCreationForm.controls.preferencesGroup.get("timeZone")?.value;
    this.newUser.status = getUserStatusByBoolean(this.userCreationForm.controls.personalDetailsGroup.get("active")?.value);
    this.newUser.permissionGroups = this.selectedPermissionGroups;
    this.newUser.passwordUpdate = this.userToEdit !== undefined && this.newUser.password.length > 0;
    this.newUser.keycloakUserId = this.userToEdit ? this.userToEdit.keycloakUserId : "";
    console.log("old user",this.userToEdit);
    console.log("updated user",this.newUser);

    this.userToEdit ? this.updateUser(this.newUser) : this.createUser(this.newUser);
  }

  createUser(user: User): void {
    this._userCreationRemoteService.createUser(user).subscribe(
        res => {
          SnackbarMessage.showGeneralMessage(this._snackBar, "User created successfully.");
        },
        error => {
          let message = "Unable to create user. Please contact support.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
          this.loading = false;
        }
    );
  }

  updateUser(user: User): void {
    this._userCreationRemoteService.updateUser(user).subscribe(
        res => {
          this.awaitingResponse = false;

          this.userToEdit!!.title = this.newUser.title;
          this.userToEdit!!.firstName = this.newUser.firstName;
          this.userToEdit!!.lastName = this.newUser.lastName;
          this.userToEdit!!.jobTitle = this.newUser.jobTitle;
          this.userToEdit!!.email = this.newUser.email;
          this.userToEdit!!.workPhoneNumber = this.newUser.workPhoneNumber;
          this.userToEdit!!.workFaxNumber = this.newUser.workFaxNumber;
          this.userToEdit!!.workMobileNumber = this.newUser.workMobileNumber;
          this.userToEdit!!.language = this.newUser.language;
          this.userToEdit!!.timeZone = this.newUser.timeZone;
          this.userToEdit!!.status = this.newUser.status;
          this.userToEdit!!.permissionGroups = [];
          this.userToEdit!!.permissionGroups.push(...this.newUser.permissionGroups);

          SnackbarMessage.showGeneralMessage(this._snackBar, "User updated successfully.");
        },
        error => {
          this.awaitingResponse = false;

          let message = "Unable to create user. Please contact support.";
          if(error?.error?.message){
            message = error.error.message;
          }
          SnackbarMessage.showGeneralErrorMessage(this._snackBar, message);
          this.loading = false;
        }
    );
  }

  getLanguages(): void {
    this._languageRemoteService.getLanguages().subscribe(
        res => {
          this.languages = res;
          this.updateLoadingState();
        },
        error => {
          this.loading = false;
          throw Error("Failed to retrieve languages");
        }
    );
  }

  getTimeZones(): void {
    this._timeZoneRemoteService.getTimeZones().subscribe(
        res => {
          this.timeZones = res;
          this.updateLoadingState();
        },
        error => {
          this.loading = false;
          throw Error("Failed to retrieve time zones");
        }
    );
  }

  resetForm(): void {
    this.userCreationForm.reset();
    this.userCreationForm.markAsUntouched();
  }

  emitUserCreationCancelled(): void {
    this.userCreationCancelled.emit();
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Confirm",
        message: "Are you sure you want to cancel user creation?",
        confirmButtonTitle: "Yes",
        cancelButtonTitle: "No",
      }
    });

    dialogRef.componentInstance.confirmClicked.subscribe(
        () => {
          this.emitUserCreationCancelled();
        }
    );

    dialogRef.afterClosed().subscribe(() => {
      dialogRef.componentInstance.confirmClicked.unsubscribe();
    });
  }

  updateLoadingState(): void {
    this.loading = (
        !this.newUser.company
        || this.permissionGroups.length === 0
        || this.languages.length === 0
        || this.timeZones.length === 0
    );
  }

}
