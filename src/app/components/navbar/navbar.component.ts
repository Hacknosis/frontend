import { Component } from '@angular/core';
import {AccountService} from "@app/services";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private accountService: AccountService) {
  }
  logout() {
    this.accountService.logout();
  }
}
