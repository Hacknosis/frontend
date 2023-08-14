import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

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
  imports: [CommonModule, ComponentsModule, RouterModule.forChild(routes)],
  exports: [Home],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
