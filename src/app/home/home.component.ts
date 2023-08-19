import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(public dialog: MatDialog) { }

  openUserProfile() {
    this.dialog.open(UserProfileComponent, {
      width: '50%',
      height: '80%'
    });
  }
}