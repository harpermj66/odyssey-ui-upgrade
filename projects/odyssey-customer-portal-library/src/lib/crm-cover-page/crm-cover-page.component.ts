import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";

@Component({
  selector: 'lib-crm-cover-page',
  templateUrl: './crm-cover-page.component.html',
  styleUrls: ['./crm-cover-page.component.scss']
})
export class CrmCoverPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,
              public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  onSignIn() {
    this.router.navigate(['/signIn']);
  }

  onSignOut() {
    this.router.navigate(['/cover-page']);
  }
}
