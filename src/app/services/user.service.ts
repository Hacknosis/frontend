import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";

import { environment } from '@environments/environment';
import { User } from '@app/models';
import Swal from "sweetalert2";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private router: Router,
        private httpClient: HttpClient
    ) {
    }

    public getUsers(): Observable<User[]> {
        let url = `${environment.apiUrl}/user/all`;
        return this.httpClient.get<User[]>(url);
    }
}
