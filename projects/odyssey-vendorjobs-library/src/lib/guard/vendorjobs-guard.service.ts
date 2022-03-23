import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {CurrentUserService} from "../../../../odyssey-service-library/src/lib/authentication/current-user.service";
import {catchError, map} from "rxjs/operators";
import {Observable, of} from "rxjs";

/**
 * Checks to make sure only users with one of the M&R roles can access a route.
 */
@Injectable()
export class VendorjobsGuardService implements CanActivate {

  constructor(private userService: CurrentUserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.loadOrGetUser().pipe(
      map(user => {
        const hasRole = !!user?.roles.VENDOR_JOB_EDITOR || !!user?.roles.VENDOR_JOB_APPROVER;
        if(!hasRole) {
          this.routeToWelcome();
        }
        return hasRole;
      }),
      catchError((error: any) => {
        this.routeToWelcome();
        return of(false);
      })
    );
  }

  private routeToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
}
