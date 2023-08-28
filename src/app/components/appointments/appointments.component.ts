import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '@app/models/patient';
import { Appointment } from '@app/models/appointment';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  patient_id: number = -1;
  patient: Patient = new Patient();
  appointments: Appointment[] = [];
  headers: string[] = ["Date/Time", "Main Provider", "Location"];

  constructor(public dialogRef: MatDialogRef<AppointmentsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = data.dataSource;
    this.displayedColumns = data.displayedColumns;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
