import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication/authentication.service";
import {ThemeService} from "../theme/theme.service";

@Injectable()
export class AuthenticationGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router,
              public themeService: ThemeService) {}

  // tslint:disable-next-line:max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.isAuthenticated()) {
      this.themeService.changeTheme(this.themeService.getCurrentCarrier());
      return true;
    } else {
      const params = {};
      route.queryParamMap.keys.forEach((key: string) => {
        // @ts-ignore
        params[key] = route.queryParamMap.get(key);
      });

      // @ts-ignore
      params['route'] = this.getPath(state.url);

      if(route.data?.application){
        // @ts-ignore
        params.application = route.data.application;
      }

      // @ts-ignore
      this.router.navigate(['/signIn'], {queryParams: params });
      return false;
    }
  }

  private getPath(url: string): string {
    let withoutParams = url.split('?')[0];
    if (withoutParams.startsWith('/')) {
      withoutParams = withoutParams.substring(1);
    }
    return withoutParams;
  }
}
