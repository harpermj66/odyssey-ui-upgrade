import {Injectable, OnDestroy} from "@angular/core";
import {AuthenticatedUser, AuthenticationService} from "./authentication.service";
import {SubscriptionsManager} from "../utils/subscriptions-manager";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CompanyDto} from "../model/company-dto";

/**
 * A service to make it easier for components to check user properties.
 */
@Injectable()
export class CurrentUserService implements OnDestroy {

  private currentUser: CurrentUser | null = null;
  private subscriptionManager = new  SubscriptionsManager();

  constructor(private authenticationService: AuthenticationService) {
   this.loadOrGetUser().subscribe();

   // Observer user changes
   this.subscriptionManager.addSub(this.authenticationService.authUserChanged.subscribe(
      newUser => this.setUser(newUser)
   ));
  }

  ngOnDestroy(): void {
    this.subscriptionManager.destroy();
  }

  /**
   * Get the current user, or null if there is no logged in user.
   */
  get user(): CurrentUser | null {
    return this.currentUser;
  }

  /**
   * Call when you need to ensure a user is loaded before performing checks.
   */
  loadOrGetUser(): Observable<CurrentUser | null> {
    return this.authenticationService.getUser().pipe(
      map(user => {
        this.setUser(user);
        return this.user;
      })
    );
  }

  private setUser(newUser?: AuthenticatedUser): void {
    if(newUser) {
      this.currentUser = new CurrentUser(newUser);
    } else {
      this.currentUser = null;
    }
  }

  // Returns true if the user satisfies any of the restrictions
  evalRestrictions(restrictions?: Restriction[]): boolean {
    if (!restrictions || restrictions.length === 0) { return true; }
    return restrictions.map(it => {
      return this.evalRestriction(it);
    }).reduce( (ac, nxt) => {
      return ac || nxt;
    });
  }

  // Verify a user satisfies a supplied restriction object
  evalRestriction(restriction?: Restriction): boolean {
    if (!restriction) {
      return true;
    }
    if (!this.currentUser) {
      return false;
    }

    // company roles
    if (restriction.roles && !restriction.roles.map(role => {
      return this.currentUser?.roles[role];
    }).reduce((ac, nxt) => {
      return ac || nxt;
    })) {
      return false;
    }

    // carrier roles
    if (restriction.carrierRoles && !restriction.carrierRoles.map(role => {
      return this.currentUser?.carrierRoles[role];
    }).reduce((ac, nxt) => {
      return ac || nxt;
    })) {
      return false;
    }

    // company prefs
    if (restriction.companyPreferences && !restriction.companyPreferences.map(pref => {
      return this.currentUser?.companyPreferences[pref];
    }).reduce((ac, nxt) => {
      return ac || nxt;
    })) {
      return false;
    }

    // carrier prefs
    if (restriction.carrierPreferences && !restriction.carrierPreferences.map(pref => {
      return this.currentUser?.carrierPreferences[pref];
    }).reduce((ac, nxt) => {
      return ac || nxt;
    })) {
      return false;
    }

    // environment vars
    if (restriction.environmentFlags && !restriction.environmentFlags.map(flag => {
      return this.currentUser?.environmentFlags[flag];
    }).reduce((ac, nxt) => {
      return ac || nxt;
    })) {
      return false;
    }

    // company type allowed
    if (restriction.companyTypesAllowed && !restriction.companyTypesAllowed.includes(this.currentUser.companyType)) {
      return false;
    }

    // company type denied
    if (restriction.companyTypesDenied && restriction.companyTypesDenied.includes(this.currentUser.companyType)) {
      return false;
    }

    return true;
  }
}

/**
 * A read-only class for the current user.
 */
export class CurrentUser {
  private static readonly ROLE_PREFIX = "ROLE_";
  private static readonly ROLE_PREFIX_LENGTH = CurrentUser.ROLE_PREFIX.length;

  readonly firstName: string;
  readonly lastName: string;
  readonly name: string;
  readonly email: string;
  readonly theme: string;
  readonly avatar?: string;
  readonly companyType: CompanyType;

  /**
   * A map of roles to whether the user has them.
   * Allows for a quicker lookup.
   * eg. if(userService.user?.roles.ADMIN) ...
   * eg. if(userService.user?.roles.["ADMIN"]) ...
   *
   * Same concept applies to carrierRoles, environmentFlags, companyPreferences, carrierPreferences
   */
  readonly roles: Roles;
  readonly carrierRoles: Roles;
  readonly environmentFlags: EnvironmentFlags;
  readonly companyPreferences: CompanyPreferences;
  readonly carrierPreferences: CompanyPreferences;
  readonly company?: CompanyDto;

  constructor(user: AuthenticatedUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.theme = user.theme;
    this.avatar = user.avatar;
    this.roles = new Roles(user.rolesList);
    this.carrierRoles = new Roles(user.carrierRolesList);
    // @ts-ignore
    this.companyType = CompanyType[user.companyType];
    this.environmentFlags = new EnvironmentFlags(user.environmentVariablesMap);
    this.companyPreferences = new CompanyPreferences(user.companyPreferencesMap);
    this.carrierPreferences = new CompanyPreferences(user.carrierPreferencesMap);
    this.company = user.company;
  }
}

/**
 * The names of attributes here (e.g. container, fullAcess) are the same as appear in
 * the Company.java entity class where company preferences are stored.
 */
class CompanyPreferences {

  [pref: string]: boolean

  readonly container: boolean;
  readonly breakBulk: boolean;
  readonly roro: boolean;
  readonly fullAccess: boolean;

  constructor(preferences: object ) {
    Object.entries(preferences).forEach( (pref) => {
      this[pref[0]] = pref[1];
    });
  }
}

class EnvironmentFlags {

  [flag: string]: boolean;

  readonly "ODYSSEY_S3_ENABLED": boolean;

  constructor(preferences: object) {
    Object.entries(preferences).forEach( (pref) => {
      this[pref[0]] = pref[1];
    });
  }
}

/**
 * A role -> assigned map for quick role lookups.
 * roles.roleName should return a boolean true or undefined (effectively false).
 */
class Roles {
  private static readonly ROLE_PREFIX = "ROLE_";
  private static readonly ROLE_PREFIX_LENGTH = Roles.ROLE_PREFIX.length;

  [role: string]: boolean

  readonly SYSADMIN: boolean;
  readonly ADMIN: boolean;
  readonly VESSEL_VIEWER: boolean;
  readonly VESSEL_EDITOR: boolean;
  readonly VESSEL_APPROVER: boolean;
  readonly BOOKING_VIEWER: boolean;
  readonly BOOKING_EDITOR: boolean;
  readonly BOOKING_APPROVER: boolean;
  readonly SCHEDULE_VIEWER: boolean;
  readonly SCHEDULE_EDITOR: boolean;
  readonly SCHEDULE_APPROVER: boolean;
  readonly TARIFF_VIEWER: boolean;
  readonly TARIFF_EDITOR: boolean;
  readonly TARIFF_APPROVER: boolean;
  readonly FEE_VIEWER: boolean;
  readonly FEE_EDITOR: boolean;
  readonly FEE_APPROVER: boolean;
  readonly DISCOUNT_VIEWER: boolean;
  readonly DISCOUNT_EDITOR: boolean;
  readonly DISCOUNT_APPROVER: boolean;
  readonly SHIPPING_INSTRUCTION_VIEWER: boolean;
  readonly SHIPPING_INSTRUCTION_EDITOR: boolean;
  readonly SHIPPING_INSTRUCTION_APPROVER: boolean;
  readonly BILL_OF_LADING_VIEWER: boolean;
  readonly FREIGHT_INVOICE_VIEWER: boolean;
  readonly FREIGHT_INVOICE_EDITOR: boolean;
  readonly FREIGHT_INVOICE_APPROVER: boolean;
  readonly SERVICE_CONTRACT_VIEWER: boolean;
  readonly SERVICE_CONTRACT_EDITOR: boolean;
  readonly SERVICE_CONTRACT_APPROVER: boolean;
  readonly MANIFEST_LOCKER: boolean;
  readonly CONTAINER_ALLOCATOR: boolean;
  readonly PRICING_EDITOR: boolean;
  readonly DATA_EDITOR: boolean;
  readonly DATA_VIEWER: boolean;
  readonly CONTAINER_STOCK_EDITOR: boolean;
  readonly CONTAINER_STOCK_VIEWER: boolean;
  readonly HAULAGE_CHARGE_EDITOR: boolean;
  readonly HAULAGE_CHARGE_VIEWER: boolean;
  readonly HAULAGE_CHARGE_APPROVER: boolean;
  readonly FREETIME_VIEWER: boolean;
  readonly FREETIME_EDITOR: boolean;
  readonly FREETIME_APPROVER: boolean;
  readonly QUOTE_APPROVER: boolean;
  readonly QUOTE_EDITOR: boolean;
  readonly QUOTE_VIEWER: boolean;
  readonly HAULAGE_ROUTE_VIEWER: boolean;
  readonly HAULAGE_ROUTE_EDITOR: boolean;
  readonly HAULAGE_ROUTE_APPROVER: boolean;
  readonly PORT_OPERATIONS_EDITOR: boolean;
  readonly PORT_OPERATIONS_APPROVER: boolean;
  readonly DISBURSEMENT_ACCOUNT_EDITOR: boolean;
  readonly DISBURSEMENT_ACCOUNT_APPROVER: boolean;
  readonly DG_APPROVER: boolean;
  readonly ACCOUNT_EDITOR: boolean;
  readonly ACCOUNT_APPROVER: boolean;
  readonly VENDOR_JOB_EDITOR: boolean;
  readonly VENDOR_JOB_APPROVER: boolean;
  readonly BUNKER_EDITOR: boolean;
  readonly MR_VIEWER: boolean;
  readonly MR_EDITOR: boolean;
  readonly MR_APPROVER: boolean;

  constructor(rolesList: string[]) {
    // Build the roles map to make role checks quicker
    rolesList?.forEach(
      role => {
        if(role) {
          if(role.startsWith(Roles.ROLE_PREFIX)) {
            role = role.substring(Roles.ROLE_PREFIX_LENGTH, role.length);
          }
          role = role
            .replace(/\s/g, '_')
            .replace(/&/g,'');
          this[role] = true;
        }
      }
    );
  }
}

export enum CompanyType {
  CARRIER,
  AGENT,
  SHIPPER,
  HAULIER,
  TERMINAL,
  DEPOT,
  SURVEYOR
}

/**
 * User must pass checks for all restriction types if set (AND)
 * see CurrentUserService.evalRestriction() where users are validated against these objects.
 */
export class Restriction {
  roles?: string[];
  carrierRoles?: string[];
  companyTypesAllowed?: CompanyType[];
  companyTypesDenied?: CompanyType[];
  environmentFlags?: string[];
  companyPreferences?: string[];
  carrierPreferences?: string[];
}
