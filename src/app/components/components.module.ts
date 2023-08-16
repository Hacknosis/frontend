import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { PatientListComponent } from './patient-list/patient-list.component';
import { NavbarComponent } from './navbar/navbar.component'

@NgModule({
  declarations: [
    PatientListComponent,
    NavbarComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
