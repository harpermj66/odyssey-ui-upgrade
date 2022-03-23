import {Company} from "./company";
import {PermissionGroup} from "./permission-group";

export class User {
    keycloakUserId: string;
    title: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    password: string;
    company: Company;
    termsAndConditionsAccepted: boolean;
    workPhoneNumber?: string;
    workMobileNumber?: string;
    workFaxNumber?: string;
    language: string;
    timeZone: string;
    permissionGroups: PermissionGroup[] = [];
    status: UserStatus = UserStatus.ACTIVE;
    checked: boolean;
    passwordUpdate: boolean;
    profilePhotoBase64: string;
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export function getUserStatusByBoolean(active: boolean): UserStatus {
    return active ? UserStatus.ACTIVE : UserStatus.INACTIVE
}

export function getBooleanFromUserStatus(status: UserStatus): boolean {
    return status === UserStatus.ACTIVE;
}
