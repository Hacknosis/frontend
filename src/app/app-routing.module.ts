import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login';
import {AuthGuard} from "@app/guards/auth.guard";
import {PatientListComponent} from "@app/components/patient-list/patient-list.component";
import {PatientDetailComponent} from "@app/components/patient-detail/patient-detail.component";

const routes: Routes = [
  { path: '', component: PatientListComponent, canActivate: [AuthGuard] },
  { path: 'account/login', component: LoginComponent },
  { path: 'patient_detail/:patient_id', component: PatientDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'account/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
