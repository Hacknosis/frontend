import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestReport} from "@app/models/test-report";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) { }

  public readReports(patient_id: number): Observable<TestReport[]> {
    let url = `${environment.apiUrl}/report/read/${patient_id}`;
    return this.httpClient.get<TestReport[]>(url);
  }
}
