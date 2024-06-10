import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from '@app/models/patient';
import { AccountService, PatientService } from "@app/services";
import {UserService} from "@app/services/user.service";
import Swal from "sweetalert2";
import { TestReport } from '@app/models/test-report';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models';
import { ReportStatus } from '@app/models/report-status';

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.css']
})
export class WorkloadComponent {
    doctor: User = new User();
    patient: Patient = new Patient();
    reports: TestReport[] = [];
    headers: string[] = ["Date", "Report Type", "Status"];
    patient_id: number = -1;

    selectMode = false;
    sendMode = false;
    selectedReport: TestReport | undefined;
    selectedUserStr: string | undefined;
    selectedUser: User = new User();
    users: User[] = [];

    constructor(public dialogRef: MatDialogRef<WorkloadComponent>, private router:Router,
        private route: ActivatedRoute,private accountService: AccountService,private userService:UserService,
        private patientService: PatientService) {
        //get users
        this.userService.getUsers().subscribe((users) => {
            this.users = users.filter(v => v.id !== this.doctor.id);  //exclude self
          },
          (error) => {
            Swal.fire('Error when fetching users', error.errors[0], 'error');
          }
        );

        const id = this.router.url.slice(-1);
        if(id==null) return;
        this.patient_id = parseInt(id);
        if(accountService.userValue == null) return;
        this.doctor = accountService.userValue;
        const res = this.doctor.patients!.find(p => p.id === this.patient_id);
        this.patient = res ? res: new Patient();

        this.patientService.readReports(this.patient_id).subscribe((res) => {
            this.reports = res.filter(v => v.reportStatus === ReportStatus.AVAILABLE);
          }, (error) => {
            Swal.fire('Error when reading report', error.errors[0],'error').then(r => {
              router.navigateByUrl("/");
            });
          });
    }

    select(report: TestReport):void {
      console.log(report);
      this.selectMode = true;
      this.selectedReport = report;
    }

    deselect(): void {
      this.selectMode = false;
      this.sendMode = false;
    }

    selectUser(user:User): void {
      this.selectedUser = user;
      this.selectedUserStr = user.name + " (" + user.username + ")";
      this.sendMode = true;
    }

    sendReport(): void {
      this.sendMode = false;
      this.patientService.addPatient(this.patient, this.selectedUser.username || '').subscribe(
        response => {
          Swal.fire('Report sent successfully','','success');
        },
        error => {
          Swal.fire('There is an error when sending the report', '', 'error');
        }
      );  
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}