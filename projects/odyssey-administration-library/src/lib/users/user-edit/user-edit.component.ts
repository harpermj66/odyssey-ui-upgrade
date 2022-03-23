import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'lib-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  addUserMessage = 'Use this form to add a new user. The userID and password will be emailed to the email address provided for this user.';
  updateUserMessage = 'Use this form to update a user. The userID and password will be emailed to the email address provided for this user.';

  viewStatus = 'add';

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.viewStatus = this.route.snapshot.queryParams['viewStatus'];
  }

  onCancel() {
    this.router.navigate(['/home/user-admin'])
  }

  onSave() {

  }
}
