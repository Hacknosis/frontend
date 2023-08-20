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

@NgModule({
  declarations: [
    PatientListComponent,
    NavbarComponent,
    PatientDetailComponent,
    LoginComponent,
  ],
  imports: [CommonModule, RouterModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatSortModule],
  exports: [
    NavbarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
