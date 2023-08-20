import {Component, ViewChild} from '@angular/core';
import {PatientService} from "../../services/patient.service";
import {Patient} from "../../models/patient";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AccountService} from "@app/services";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {
  public headerName: string[] = ["Patient ID", "Name", "Age", "Birth Sex", "Allergies", "Special Indicators", "Room No", "Code Status", "Chief Summary"];
  public patientsList: Patient[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private patientService: PatientService,
              private accountService: AccountService,
              private router: Router) {
    accountService.user.subscribe(v => {
      this.patientsList = v?.patients!;
      console.log(this.patientsList);
    });
  }
  public selectedPatient(patient: Patient) {
    console.log(patient);
    this.router.navigateByUrl(`patient_detail/${patient.id}`);
  }
}
