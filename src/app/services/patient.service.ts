import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TestReport} from "@app/models/test-report";
import {environment} from "@environments/environment";
import { Appointment } from '@app/models/appointment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) { }

  public readReports(patient_id: number): Observable<TestReport[]> {
    let url = `${environment.apiUrl}/report/patient_report/read/${patient_id}`;
    return this.httpClient.get<TestReport[]>(url);
  }

  createAppointment(patientId: number, appointment: Appointment): Observable<Appointment> {
    const url = `${environment.apiUrl}/patient/appointment/${patientId}`;
    return this.httpClient.put<Appointment>(url, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    const url = `${environment.apiUrl}/patient/appointment/${appointmentId}`;
    return this.httpClient.delete(url,{ responseType: 'text' });
  }

  readPublicationResource(publicationId: string): Observable<string> {
    const url = `${environment.apiUrl}/report/publication/read/${publicationId}`;
    return this.httpClient.get(url, {responseType: 'text'});
  }

  uploadReport(patientId: number, formData: FormData): Observable<any> {
    const url = `${environment.apiUrl}/report/image/upload/${patientId}`;
    return this.httpClient.post(url, formData, {responseType: 'text'});
  }

  uploadTextualReport(patientId: number, formData: FormData): Observable<any> {
    const url = `${environment.apiUrl}/report/textual/upload/${patientId}`;
    return this.httpClient.post(url, formData, {responseType: 'text'});
  }
}
