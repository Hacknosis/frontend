import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/models';
import { AccountService } from '../../services/account.service';
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  editMode = false;
  edited: User;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.edited = { ...user };
    this.form = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editProfile(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.form.reset();
  }

  saveChanges(): void {
    if (this.form.valid) {
      if (this.form.value.password === this.edited.password) {
        Swal.fire('Update Warning', 'Your new password is the same as the current password.', 'warning');
        return; 
      }
      this.edited.password = this.form.value.password;
      this.accountService.updateUserInfo(this.edited)
        .subscribe(
          response => {
            Swal.fire("Success", response, "success").then(r => {
              this.cancelEdit();
            });
          },
          error => {
            Swal.fire('Update Error', 'Your password is not updated', 'error');
          }
        );
    } else {
      Swal.fire('Update Warning', 'Please enter a new password.', 'warning');
    }
  }
}
