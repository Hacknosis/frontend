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
import {UserProfileComponent} from "@app/components/user-profile/user-profile.component";
import {MatDialogModule} from "@angular/material/dialog";
import { FeatureTextDescriptionComponent } from './feature-text-description/feature-text-description.component';
import { PatientRecentComponent } from './patient-recent/patient-recent.component';
import { ReportUploadComponent } from './report-upload/report-upload.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PatientListComponent,
    NavbarComponent,
    PatientDetailComponent,
    LoginComponent,
    UserProfileComponent,
    FeatureTextDescriptionComponent,
    PatientRecentComponent,
    ReportUploadComponent
  ],
  imports: [CommonModule, RouterModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatSortModule, MatDialogModule, FormsModule],
  exports: [
    NavbarComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
