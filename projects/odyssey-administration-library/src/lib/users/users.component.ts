import { Component, OnInit } from '@angular/core';
import {UserRemoteService} from "../../../../odyssey-service-library/src/lib/administration/user-remote.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UserRemoteService]
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
