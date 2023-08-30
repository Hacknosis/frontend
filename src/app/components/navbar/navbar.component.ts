import { Component } from '@angular/core';
import {AccountService} from "@app/services";
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { User } from '@app/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User | null;

  constructor(public dialog: MatDialog,private accountService: AccountService) {
    this.user = this.accountService.userValue;
  }
  logout() {
    this.accountService.logout();
  }

  openUserProfile() {
    this.dialog.open(UserProfileComponent, {
      disableClose: true,
      width: '30%',
      height: '60%',
      data: this.user 
    });
  }

  async fileReport() {
    // call reportservice here
  }
}
