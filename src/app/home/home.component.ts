import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/services';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { User } from '@app/models';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: User | null;
  constructor(public dialog: MatDialog, private accountService: AccountService) {this.user = this.accountService.userValue; }

  openUserProfile() {
    this.dialog.open(UserProfileComponent, {
      disableClose: true,
      width: '30%',
      height: '60%',
      data: this.user 
    });
  }
}