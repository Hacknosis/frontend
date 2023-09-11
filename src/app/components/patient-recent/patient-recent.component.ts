import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { MatDialogRef } from '@angular/material/dialog';
import { Patient } from '../../models/patient';
import { PatientService } from '@app/services';

@Component({
  selector: 'app-patient-recent',
  templateUrl: './patient-recent.component.html',
  styleUrls: ['./patient-recent.component.css']
})
export class PatientRecentComponent {
  recentlyAccessedPatients: Patient[] = [];
  public headerName: string[] = ["Patient ID", "Name", "Age", "Birth Sex", "Room No"];

  constructor(public dialogRef: MatDialogRef<PatientRecentComponent>,
              public patientService: PatientService,
              private router:Router) { }

  ngOnInit(): void {
    // Retrieve patients
    this.recentlyAccessedPatients = this.patientService.getRecentlyAccessedPatients();
    console.log("Recent Patients");
    console.log(this.recentlyAccessedPatients);
  }

  public selectedPatient(patient: Patient) {
    this.closeDialog();
    console.log(patient);
    this.router.navigateByUrl(`patient_detail/${patient.id}`);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
