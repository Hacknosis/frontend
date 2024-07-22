import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Patient } from '@app/models/patient';
import { AccountService, PatientService } from "@app/services";
import {UserService} from "@app/services/user.service";
import Swal from "sweetalert2";
import { ImageReport } from '@app/models/image-report';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models';
import { ReportStatus } from '@app/models/report-status';
import {ReportService} from "@app/services/report.service";
import {TextualReport} from "@app/models/textual-report";

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.css']
})
export class WorkloadComponent {
    doctor: User = new User();
    patient: Patient = new Patient();
    textualReports: TextualReport[] = [];
    imageReports: ImageReport[] = [];
    headers: string[] = ["Date", "Report Type", "Status"];
    patient_id: number = -1;

    selectMode = false;
    sendMode = false;
    selectedReport: ImageReport | undefined;
    selectedUserStr: string | undefined;
    selectedUser: User = new User();
    users: User[] = [];

    constructor(public dialogRef: MatDialogRef<WorkloadComponent>, private router:Router,
        private route: ActivatedRoute,private accountService: AccountService,private userService:UserService,
        private patientService: PatientService,
        private reportService: ReportService) {
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

        this.reportService.readTextualReports(this.patient_id).subscribe((res) => {
            this.textualReports = res.filter(v => v.reportStatus === ReportStatus.AVAILABLE);
          }, (error) => {
            Swal.fire('Error when reading textual reports', error.errors[0],'error').then(r => {
              router.navigateByUrl("/");
            });
          });

        this.reportService.readImageReports(this.patient_id).subscribe((res) => {
          this.imageReports = res.filter(v => v.reportStatus === ReportStatus.AVAILABLE);
        }, (error) => {
          Swal.fire('Error when reading image reports', error.errors[0],'error').then(r => {
            router.navigateByUrl("/");
          });
        });
    }

    select(report: ImageReport):void {
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
