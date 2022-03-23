import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from "../../../../odyssey-service-library/src/lib/authentication/authentication.service";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router,
              public authenticationService: AuthenticationService,
              public themeService: ThemeService) {}

  currentState = 'no-action';

  ngOnInit(): void {
  }

  onSignIn(): void {
    this.router.navigate(['signIn']);
  }

  onSignOut(): void {
    this.authenticationService.logout();
  }

}
