import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'

import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
import {PatientListComponent} from "./components/patient-list/patient-list.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./services/auth-interceptor.service";

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/login.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard', component: PatientListComponent
  }
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ComponentsModule,
    HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
