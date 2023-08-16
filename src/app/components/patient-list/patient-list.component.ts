import { Component } from '@angular/core';
import {PatientService} from "../../services/patient.service";
import {Patient} from "../../models/patient";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {
  public headerName: string[] = ["Patient ID", "Name", "Age", "Birth Sex", "Allergies", "Special Indicators", "Room No", "Code Status", "Chief Summary"];
  public patientsList: Patient[] = [];
  constructor(private patientService: PatientService,
              private httpClient: HttpClient) {
    this.userInfo();
  }
  private userInfo(): void {
    let url = `${environment.baseUrl}/auth/user_info`;
    this.httpClient.get<any>(url).subscribe((v) => {
      this.patientsList = v.patients;
      console.log(this.patientsList);
    });
  }
}
