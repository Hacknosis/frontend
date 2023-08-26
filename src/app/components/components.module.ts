import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { PatientListComponent } from './patient-list/patient-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component'
import {LoginComponent} from "@app/components/login";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {UserProfileComponent} from "@app/components/user-profile/user-profile.component";
import {NgxImageZoomModule} from "ngx-image-zoom";

@NgModule({
  declarations: [
    PatientListComponent,
    NavbarComponent,
    PatientDetailComponent,
    LoginComponent,
    UserProfileComponent
  ],
  imports: [CommonModule, RouterModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatSortModule, MatDialogModule, NgxImageZoomModule],
  exports: [
    NavbarComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
