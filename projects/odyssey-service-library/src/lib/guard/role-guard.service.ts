import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CurrentUserService } from "../authentication/current-user.service";

/**
 * A guard that prevents users from proceeding if they do not have at least one of the specified roles.
 * Requires data specified on the route:
 * {
 *         path: 'a-path',
 *         component: AComponent,
 *         canActivate: [RoleGuardService],
 *         data: { requiredRoles: ['role1'] }
 * }
 */
@Injectable()
export class RoleGuardService {

  constructor(private userService: CurrentUserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const roles: string[] = route.data.requiredRoles;
    if (!roles || roles.length === 0) {
      return false;
    }

    return this.userService.loadOrGetUser().pipe(
        map(user => {
          let hasRole = false;
          for (const role of roles) {
            hasRole = !!user?.roles[role];
            if (hasRole) {
              break;
            }
          }

          if (!hasRole) {
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