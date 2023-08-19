import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '@app/services';
import { User } from '@app/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  //Edit
  editMode = false;
  editForm: FormGroup;
  editedUser: User = {};

  constructor(private accountService: AccountService,private dialogRef: MatDialogRef<UserProfileComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: User, private formBuilder: FormBuilder ) { this.user = data; 
      this.editForm = this.formBuilder.group({
        firstName: [''],
        lastName: ['']}); }

  ngOnInit() {
    this.user = this.accountService.userValue;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editedUser = { ...this.data };
      this.editForm.patchValue(this.editedUser); // Update form values with user data
    }
  }

  saveChanges() {
    if (this.editForm.valid) {
      // Update user data with form values
      this.editedUser = { ...this.editForm.value };
      // Send updated user data to the backend and update user
      // Once saved, update the user and exit edit mode
      // Call a function to update the backend user data
      // ...

      this.editMode = false;
    }
  }

  cancelEdit() {
    this.editMode = false;
  }
}
