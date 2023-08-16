import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { MaterialModule } from 'src/material.module'

import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr'
import { ComponentsModule } from '../../components/components.module'
import { ClickOutsideDirective } from './clickOutside.directive';
import { Home } from './login.component'

const routes = [
  {
    path: '',
    component: Home,
  },
]

@NgModule({
  declarations: [Home, ClickOutsideDirective],
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes), MaterialModule,
  ReactiveFormsModule, HttpClientModule, ToastrModule.forRoot()],
  exports: [Home],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
