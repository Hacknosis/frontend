import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/services';
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.accountService.userValue;
        if (user) {
            return true;
        }

        Swal.fire("Session Ended", "Please login again", "error").then(r => {
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        });
        return false;
    }
}
