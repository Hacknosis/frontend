import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject,Observable} from "rxjs";
import {ImageReport} from "@app/models/image-report";
import {environment} from "@environments/environment";
import { Appointment } from '@app/models/appointment';
import { Patient } from '@app/models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private recentlyAccessedPatients: Patient[] = [];

  constructor(private httpClient: HttpClient) { }

  public addPatient(patient: Patient, username: String): Observable<any> {
    let url = `${environment.apiUrl}/user/add_patient/${username}`;
    return this.httpClient.post(url, patient, { responseType: 'text' });
  }

  createAppointment(patientId: number, appointment: Appointment): Observable<Appointment> {
    const url = `${environment.apiUrl}/patient/appointment/${patientId}`;
    return this.httpClient.put<Appointment>(url, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    const url = `${environment.apiUrl}/patient/appointment/${appointmentId}`;
    return this.httpClient.delete(url,{ responseType: 'text' });
  }

  addToRecentlyAccessed(patient: Patient) {
    if (!this.recentlyAccessedPatients.includes(patient)) {
      this.recentlyAccessedPatients.unshift(patient);
      this.recentlyAccessedPatients = this.recentlyAccessedPatients.slice(0, 5); // Only 5 patients at a time
      this.storeRecentlyAccessedPatients(this.recentlyAccessedPatients);
    }
  }

  private storeRecentlyAccessedPatients(patients: Patient[]) { //store recently accessed in session
    sessionStorage.setItem('recentlyAccessedPatients', JSON.stringify(patients));
  }

  private getStoredRecentlyAccessedPatients(): Patient[] {
    const data = sessionStorage.getItem('recentlyAccessedPatients');
    return data ? JSON.parse(data) : [];
  }

  getRecentlyAccessedPatients() {
    return this.getStoredRecentlyAccessedPatients();
  }
}
