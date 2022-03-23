import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {Company} from "../model/company";
import {User} from "../model/user";
import {UserRegistrationService} from "../service/user-registration/user-registration.service";
import { UnLocode } from '../../../../odyssey-service-library/src/lib/model/lookup/un-locode';
import {Currency} from "../model/currency";
import {CompanyLookupRemoteService} from "../service/company-lookup/company-lookup-remote.service";
import {PlacePrediction} from "../model/google/place-prediction";
import {PlaceDetail} from "../model/google/place-detail";
import { PasswordValidation } from '../util/validation/password-validation';
import { EmailValidation } from "../util/validation/email-validation";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {CarrierRemoteService} from "../service/carrier/carrier-remote.service";
import {Router} from "@angular/router";

@Component({
    selector: 'lib-user-registration-page',
    templateUrl: './user-registration-page.component.html',
    styleUrls: ['./user-registration-page.component.css']
})
export class UserRegistrationPageComponent implements OnInit {
    currentCarrierId: number
    personalDetailsForm: FormGroup;
    companyDetailsForm: FormGroup;
    termsAndConditionsForm: FormGroup;
    termsAndConditionsAccepted = false
    user = new User();
    selectedCurrency: Currency;
    selectedUnLocode: UnLocode;
    excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
    timeout: any;
    debounce = 500;
    companyPredictions: PlacePrediction[] = [];
    registrationSuccessMessage = "";
    registrationErrorMessage = "";

    constructor(
        private _formBuilder: FormBuilder,
        private _userRegistrationService: UserRegistrationService,
        private _companyLookupRemoteService: CompanyLookupRemoteService,
        private _themeService: ThemeService,
        private _carrierRemoteService: CarrierRemoteService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        const carrierName = this._themeService.getCurrentCarrierFullName()

        this._carrierRemoteService.findCarrierByName(carrierName).subscribe(
            response => {
                this.currentCarrierId = response
            },
            error => {
                console.log(error)
            }
        )

        this.personalDetailsForm = this._formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.email],
            emailRepeat: ['',
                [
                    Validators.email,
                    EmailValidation.matchEmail
                ]
            ],
            password: ['',
                [
                    Validators.minLength(PasswordValidation.MIN_LENGTH),
                    Validators.maxLength(PasswordValidation.MAX_LENGTH),
                ]
            ],
            passwordRepeat: ['',
                [
                    Validators.required,
                    PasswordValidation.matchPassword
                ]
            ],
        });

        this.companyDetailsForm = this._formBuilder.group({
            companyNameLookup: [''],
            companyName: ['', Validators.required],
            shortName: ['', Validators.required],
            eori: [''],
            address: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            postcode: ['', Validators.required],
            phone: [''],
            fax: [''],
        });
    }

    setSelectedCurrency(currency: Currency): void {
        this.selectedCurrency = currency;
    }

    populateCompanyFields(place: PlaceDetail): void {
        this.companyDetailsForm.patchValue({
            companyName: place.name,
            address: place.formattedAddress,
            city: place.city,
            country: place.country,
            postcode: place.postcode,
            phone: place.internationalPhoneNumber,
        });
    }

    setUnLocodeAndPopulateFields(unLocode: UnLocode) {
        this.selectedUnLocode = unLocode;

        this.companyDetailsForm.patchValue({
            city: unLocode.city,
            country: unLocode.countryName,
        });
    }

    submitPersonalDetails(): void{
        const values = this.personalDetailsForm.value;
        this.user.title = values.title;
        this.user.firstName = values.firstName;
        this.user.lastName = values.lastName;
        this.user.email = values.email;
        this.user.password = values.password;
    }

    submitCompanyDetails(): void{
        const values = this.companyDetailsForm.value;
        let company = new Company();
        company.companyName = values.companyName;
        company.shortName = values.shortName;
        company.eori = values.eori;
        company.address = values.address;
        company.currency = this.selectedCurrency;
        company.unLocode = this.selectedUnLocode;
        company.carrierId = this.currentCarrierId;
        company.country = values.country;
        company.city = values.city;
        company.postcode = values.postcode;
        company.phone = values.phone;
        company.fax = values.fax;
        this.user.company = company;
    }

    findPlacePredictions(event: KeyboardEvent): void {
        if(this.excludedKeys.includes(event.key)) { return; }

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        const searchValue = this.companyDetailsForm.controls.companyNameLookup.value;

        this.timeout = setTimeout(() => {
            this._companyLookupRemoteService.findPlacePredictions(searchValue).subscribe(
                (response) => {
                    this.companyPredictions = response.predictions;
                },
                (error) => {
                    this.companyPredictions = [];
                    console.log(error);
                },
            );
        }, this.debounce);
    }

    getPlaceDetails(prediction: PlacePrediction): void {
        console.log(prediction.place_id)
        this._companyLookupRemoteService.getPlaceDetails(prediction.place_id).subscribe(
            (response) => {
                this.populateCompanyFields(response as PlaceDetail)
            },
            (error) => {
                console.log(error);
            },
        );
    }

    getPredictionDescription(prediction: PlacePrediction): string {
        return prediction ? prediction.description : '';
    }

    register(): void{
        this.user.termsAndConditionsAccepted = this.termsAndConditionsAccepted;

        if(!this.user.termsAndConditionsAccepted){
            this.registrationErrorMessage = "Terms and Conditions must be accepted."
            return;
        }

        this._userRegistrationService.registerUser(this.user).subscribe(
            (response) => {
                this.registrationSuccessMessage = "Registration Successful.";
                this.registrationErrorMessage = "";
                this._router.navigate(["signIn"], {queryParams: { route: 'cover-page/dashboard', application: "customer-portal"}});
            },
            (error) => {
                let message = "Unable to register. Please contact support.";
                if(error?.error?.message){
                    message = error.error.message;
                }
                this.registrationErrorMessage = message;
                this.registrationSuccessMessage = "";
            }
        );
    }

}
