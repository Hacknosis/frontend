import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";

import { environment } from '@environments/environment';
import { User } from '@app/models';
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private httpClient: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    public login(username: string, password: string): Observable<User> {
        let url = `${environment.apiUrl}/auth/login`;
        return this.httpClient.post<{ access_token: string, user: User }>(url, { username, password })
            .pipe(map(response => {
                console.log(response);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('acc', response.access_token);
                sessionStorage.setItem('user', JSON.stringify(response.user));
                this.userSubject.next(response.user);
                return response.user;
            }));
    }

    public logout() {
        // remove user from local storage and set current user to null
        sessionStorage.clear();
        this.userSubject.next(null);
        Swal.fire("Session Ended", "Please login again", "error").then(r => {
          this.router.navigate(['/account/login']);
        });
    }
}
