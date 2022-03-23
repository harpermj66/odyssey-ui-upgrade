import { Injectable } from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor(private authenticationService: AuthenticationService) {
  }
}
