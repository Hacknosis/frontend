class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {AccountService, PatientService} from "@app/services";
import {User} from "@app/models";
import {Patient} from "@app/models/patient";
import {TestReport} from "@app/models/test-report";
import {ReportStatus} from "@app/models/report-status";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentsComponent } from '../appointments/appointments.component';
import {resolve} from "@angular/compiler-cli";
import {elementAt} from "rxjs";

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  viewing: boolean = false;
  patient_id: number = -1;
  doctor: User = new User();
  patient: Patient = new Patient();
  pendingReports: TestReport[] = [];
  availableReports: TestReport[] = [];
  headerName: string[] = ["Date", "Report Type", "Status"];
  viewer: any = undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private patientService: PatientService,
              private dialog: MatDialog) {

    const id = this.route.snapshot.paramMap.get("patient_id");
    if (id === null) {
      Swal.fire('Invalid URL', 'error').then(r => {
          router.navigateByUrl("/");
      });
      return;
    } else if (accountService.userValue === null) {
      accountService.logout();
      return;
    }
    this.patient_id = parseInt(id);
    this.doctor = accountService.userValue;
    const res = this.doctor.patients!.find(p => p.id === this.patient_id);
    this.patient = res ? res: new Patient();
    if (this.patient.id === 0) {
      Swal.fire('Invalid Patient', 'Patient is not in the database anymore','error').then(r => {
        router.navigateByUrl("/");
      });
      return;
    }
    this.patientService.readReports(this.patient_id).subscribe((res) => {
      this.availableReports = res.filter(v => v.reportStatus === ReportStatus.AVAILABLE);
      this.pendingReports = res.filter(v => v.reportStatus !== ReportStatus.AVAILABLE);
    }, (error) => {
      Swal.fire('Error when reading report', error.errors[0],'error').then(r => {
        router.navigateByUrl("/");
      });
    });
  }

  ngOnInit(): void {
    //this.loadBravaScript();
    //this.loadBravaViewer();
  }

  openReport(report: TestReport) {
    this.viewing = true;
    this.accountService.exchangeToken().subscribe(token => {
      this.viewer.setHttpHeaders({ Authorization: 'Bearer ' + token });
      this.patientService.readPublicationResource(report.publicationId).subscribe(
        res => {
          this.viewer.addPublication(JSON.parse(res), true);
          this.viewer.render();
        }, error => {
          Swal.fire("Error loading report resource", error.errors[0], 'error');
        }
      )
    }, error => {
      this.accountService.logout();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppointmentsComponent, {
      disableClose: true,
      width: '70%',
      height: '60%',
      data: { patient: this.patient }
    });
  }

  loadBravaScript(): void {
    const url: string = "https://na-1-dev.api.opentext.com/viewer/api/v1/viewers/brava-view-1.x/loader";
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  loadBravaViewer(): void {
    const onBravaReady = (e: any) => {
      console.log("Brava Ready:", e.detail);
      this.viewer = window[e.detail];
    };

    window.addEventListener("bravaReady", onBravaReady);

    setInterval(() => {
      this.accountService.exchangeToken().subscribe(token => {
        this.viewer.setHttpHeaders({ Authorization: 'Bearer ' + token });
      }, error => {
        this.accountService.logout();
      });
    }, 30000);
  } 


  /*
  upload(image: any) {
     // console.log("preparing file")
    const file: File = image.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
    this.selectedFile = new ImageSnippet(event.target.result, file);
    this.templateService.saveTemplate(this.selectedFile.file).subscribe(
    (res) => {
      alert("You have successfully uploaded the file");
    },
    (err) => {
      alert("Upload failed");
   })
    });
     reader.readAsDataURL(file);
    }
    */
}
