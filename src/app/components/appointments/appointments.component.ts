import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '@app/models/patient';
import { Appointment } from '@app/models/appointment';
import { PatientService } from "@app/services";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {
  patient: Patient = new Patient();
  appointments: Appointment[] = [];
  headers: string[] = ["Appointment Time", "Main Provider", "Location"];

  constructor(public dialogRef: MatDialogRef<AppointmentsComponent>,
    private patientService: PatientService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.patient = data.patient;
      this.appointments = this.patient.appointments;
      console.log(this.appointments);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
