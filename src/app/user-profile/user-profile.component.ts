import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '@app/services';
import { User } from '@app/models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private accountService: AccountService,private dialogRef: MatDialogRef<UserProfileComponent>) { }

  ngOnInit() {
    this.user = this.accountService.userValue;
  }

  closeDialog() {
    this.dialogRef.close(); // Close the profile
  }
}
