import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationRemoteService} from "../../../../../odyssey-service-library/src/lib/authentication/authentication-remote.service";

@Component({
  selector: 'lib-odyssey-router',
  templateUrl: './odyssey-router.component.html',
  styleUrls: ['./odyssey-router.component.css']
})
export class OdysseyRouterComponent implements OnInit {

  uuid: number = 0;
  routePath: string = '';

  constructor(public authenticationService: AuthenticationService,
              private authenticationRemoteService: AuthenticationRemoteService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

     // if (this.authenticationService.injectedRefreshToken.length == 0) {
      this.uuid = this.route.snapshot.queryParams['uuid'];
      this.routePath = this.route.snapshot.queryParams['routePath'];
      this.authenticationRemoteService.loadRefreshToken(this.uuid).subscribe( (result: any)  => {
        if (result["refreshToken"] != '-1') {
          this.authenticationService.setRefreshToken(result["refreshToken"] as string);
          this.forward();
        } else {
        }
       });
    // } else {
    //   this.forward()
    // }

  }

  forward() {
    this.router.navigate([this.routePath]);
  }

}
