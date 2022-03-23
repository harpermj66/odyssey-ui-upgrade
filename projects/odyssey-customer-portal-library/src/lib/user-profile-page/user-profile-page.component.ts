import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserRegistrationService} from "../service/user-registration/user-registration.service";
import {CompanyLookupRemoteService} from "../service/company-lookup/company-lookup-remote.service";
import {CompanyRemoteService} from "../service/company/company-remote.service";
import {CarrierRemoteService} from "../service/carrier/carrier-remote.service";
import {UserCreationRemoteService} from "../service/user-creation/user-creation-remote.service";
import {PermissionGroupRemoteService} from "../service/permission-group/permission-group-remote.service";
import {LanguageRemoteService} from "../service/language/language-remote.service";
import {TimeZoneRemoteService} from "../service/time-zone/time-zone-remote.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../model/user";
import {PermissionGroup} from "../model/permission-group";
import {Language} from "../model/language";
import {TimeZone} from "../model/time-zone";
import {PasswordValidation} from "../util/validation/password-validation";
import {
  CurrentUser,
  CurrentUserService
} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import { SnackbarMessage } from "../../../../odyssey-service-library/src/lib/utils/snackbar-message";
import {UserListRemoteService} from "../service/user-list/user-list-remote.service";
import {UserUpdateRemoteService} from "../service/user-update/user-update-remote.service";

@Component({
  selector: 'lib-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent implements OnInit {

  @Output() userCreationCancelled = new EventEmitter<void>();

  userProfileForm: FormGroup;
  currentUser: CurrentUser;
  currentCompanyId: number;
  updatedUser = new User();
  _user: User;
  permissionGroups: PermissionGroup[] = [];
  selectedPermissionGroups: PermissionGroup[] = [];
  languages: Language[] = [];
  timeZones: TimeZone[] = [];
  awaitingResponse = false;
  loadingUser = false;
  passwordUpdate = false;
  selectedPhoto: ImageSnippet;
  photoSrc = "https://via.placeholder.com/100?text=Photo";

  constructor(
      private _formBuilder: FormBuilder,
      private _companyRemoteService: CompanyRemoteService,
      private _userUpdateRemoteService: UserUpdateRemoteService,
      private _userListRemoteService: UserListRemoteService,
      private _permissionGroupRemoteService: PermissionGroupRemoteService,
      private _languageRemoteService: LanguageRemoteService,
      private _timeZoneRemoteService: TimeZoneRemoteService,
      private _currentUserService: CurrentUserService,
      private _snackBar: MatSnackBar,
  ) {
    this._currentUserService.loadOrGetUser().subscribe( u => {
      this.currentUser = u!!;
      this.currentCompanyId = this.currentUser.company?.companyId!!;

      this.getUser();
      this.getUserCompany();
      this.getLanguages();
      this.getTimeZones();
    });
  }

  ngOnInit(): void {
    this.userProfileForm = this._formBuilder.group({
      personalDetailsGroup: this._formBuilder.group({
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        jobTitle: [''],
        email: ['', Validators.email],
        password: ['',
          [
            Validators.minLength(0),
            Validators.maxLength(PasswordValidation.MAX_LENGTH),
          ]
        ],
        passwordRepeat: ['',
          [
            PasswordValidation.matchPassword
          ]
        ],
      }),
      contactDetailsGroup: this._formBuilder.group({
        workPhoneNumber: [''],
        workFaxNumber: [''],
        workMobileNumber: [''],
      }),
      preferencesGroup: this._formBuilder.group({
        language: [''],
        timeZone: [''],
      }),
    });

    const passwordRepeatControl = this.userProfileForm.controls.personalDetailsGroup.get("passwordRepeat")!!;
    const passwordControl = this.userProfileForm.controls.personalDetailsGroup.get("password")!!;

    passwordControl.valueChanges.subscribe(value => {
      this.passwordUpdate = value.length > 0;

      if(this.passwordUpdate){
        passwordControl.setValidators(
          [
            Validators.minLength(PasswordValidation.MIN_LENGTH),
            Validators.maxLength(PasswordValidation.MAX_LENGTH),
          ]
        );

        passwordRepeatControl.setValidators(
          [
            Validators.required,
            PasswordValidation.matchPassword
          ]
        );
      }
    });
  }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;

    this.userProfileForm.patchValue({
      personalDetailsGroup: {
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        email: user.email,
      },
      contactDetailsGroup:{
        workPhoneNumber: user.workPhoneNumber,
        workFaxNumber: user.workFaxNumber,
        workMobileNumber: user.workMobileNumber,
      },
      preferencesGroup:{
        language: user.language,
        timeZone: user.timeZone,
      },
    });
  }

  submitForm(): void {
    this.awaitingResponse = true;

    this.updatedUser.title = this.userProfileForm.controls.personalDetailsGroup.get("title")?.value;
    this.updatedUser.firstName = this.userProfileForm.controls.personalDetailsGroup.get("firstName")?.value;
    this.updatedUser.lastName = this.userProfileForm.controls.personalDetailsGroup.get("lastName")?.value;
    this.updatedUser.jobTitle = this.userProfileForm.controls.personalDetailsGroup.get("jobTitle")?.value;
    this.updatedUser.email = this.userProfileForm.controls.personalDetailsGroup.get("email")?.value;
    this.updatedUser.password = this.userProfileForm.controls.personalDetailsGroup.get("password")?.value;
    this.updatedUser.workPhoneNumber = this.userProfileForm.controls.contactDetailsGroup.get("workPhoneNumber")?.value;
    this.updatedUser.workMobileNumber = this.userProfileForm.controls.contactDetailsGroup.get("workMobileNumber")?.value;
    this.updatedUser.workFaxNumber = this.userProfileForm.controls.contactDetailsGroup.get("workFaxNumber")?.value;
    this.updatedUser.language = this.userProfileForm.controls.preferencesGroup.get("language")?.value;
    this.updatedUser.timeZone = this.userProfileForm.controls.preferencesGroup.get("timeZone")?.value;
    this.updatedUser.passwordUpdate = this.updatedUser.password.length > 0;
    this.updatedUser.keycloakUserId = this.user.keycloakUserId;
    this.updatedUser.profilePhotoBase64 = this.selectedPhoto ? this.selectedPhoto.src : "";

    this.updateUser(this.updatedUser);
  }

  updateUser(user: User): void {
    this._userUpdateRemoteService.updateUser(user).subscribe(
        res => {
          this.awaitingResponse = false;

          this.user.title = this.updatedUser.title;
          this.user.firstName = this.updatedUser.firstName;
          this.user.lastName = this.updatedUser.lastName;
          this.user.email = this.updatedUser.email;
          this.user.jobTitle = this.updatedUser.jobTitle;
          this.user.workPhoneNumber = this.updatedUser.workPhoneNumber;
          this.user.workFaxNumber = this.updatedUser.workFaxNumber;
          this.user.workMobileNumber = this.updatedUser.workMobileNumber;
          this.user.language = this.updatedUser.language;
          this.user.timeZone = this.updatedUser.timeZone;
          this.user.profilePhotoBase64 = this.updatedUser.profilePhotoBase64;

          SnackbarMessage.showGeneralMessage(this._snackBar, "Profile updated successfully.");
        },
        error => {
          this.awaitingResponse = false;
          SnackbarMessage.showGeneralErrorMessage(
            this._snackBar,
            this.getErrorMessage(error, "Unable to update profile.")
          );
        }
    );
  }

  getUser(): void {
    this.loadingUser = true;
    this._userListRemoteService.findPortalUserByEmail(this.currentUser.email).subscribe(
        res => {
            this.user = res;
            this.loadingUser = false;
            this.photoSrc = this.user.profilePhotoBase64.length > 0 ? this.user.profilePhotoBase64 : "https://via.placeholder.com/100?text=Photo";
        },
        error => {
            SnackbarMessage.showGeneralErrorMessage(
              this._snackBar,
              this.getErrorMessage(error, "Unable to retrieve current user.")
            );
            this.loadingUser = false;
            throw Error("Failed to retrieve current user.");
        }
    );
  }

  getErrorMessage(error: any, defaultMessage = "An error has occurred."): string {
    let message = defaultMessage;

    if(error?.error?.message){
      message = error.error.message;
    }

    return message;
  }

  getUserCompany(): void {
    this._companyRemoteService.findCompanyById(this.currentCompanyId).subscribe(
        res => {
          this.updatedUser.company = res;
        },
        error => {
          SnackbarMessage.showGeneralErrorMessage(
            this._snackBar,
            this.getErrorMessage(error, "Unable to retrieve current user's company.")
          );
          throw Error("Failed to retrieve current user's company.");
        }
    );
  }

  getLanguages(): void {
    this._languageRemoteService.getLanguages().subscribe(
        res => {
          this.languages = res;
        },
        error => {
          SnackbarMessage.showGeneralErrorMessage(
            this._snackBar,
            this.getErrorMessage(error, "Unable to retrieve languages.")
          );
          throw Error("Failed to retrieve languages");
        }
    );
  }

  getTimeZones(): void {
    this._timeZoneRemoteService.getTimeZones().subscribe(
        res => {
          this.timeZones = res;
        },
        error => {
          SnackbarMessage.showGeneralErrorMessage(
            this._snackBar,
            this.getErrorMessage(error, "Unable to retrieve time zones.")
          );
          throw Error("Failed to retrieve time zones");
        }
    );
  }

  setProfilePhoto(files: FileList | null): void {
    if(!files || !files[0]) { return; }

    const file = files[0];
    const maxSize = 500000; // bytes = 500kb
    const allowedTypes = ['image/png', 'image/jpeg'];

    if(file.size > maxSize){
      SnackbarMessage.showGeneralErrorMessage(this._snackBar, `Maximum image size allowed is ${maxSize / 1000}KB.`);
      return;
    }

    if(!allowedTypes.includes(file.type)){
      SnackbarMessage.showGeneralErrorMessage(this._snackBar, `Image must be of type JPG or PNG`);
      return;
    }

    const fileReader = new FileReader();

    fileReader.addEventListener('load', (event: any) => {
      this.selectedPhoto = new ImageSnippet(event.target.result, file);
      this.photoSrc = this.selectedPhoto.src;
    });

    fileReader.readAsDataURL(file);
  }

}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
