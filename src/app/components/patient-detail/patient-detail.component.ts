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
import { AppointmentsComponent } from '../appointments/appointments.component';
import {ReportType} from "@app/models/report-type";

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
  text: boolean = false;
  textContent: string = "";

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
    if (report.type === ReportType.TEXT) {
      this.text = true;
      this.textContent = report.content;
    } else {
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


  async uploadFile(file: any) {
    const selectedFile = file.files[0];
    const formData = new FormData();
    formData.append('report', selectedFile);
    const { value: fileType } = await Swal.fire({
      title: 'Select Report Type',
      input: 'select',
      inputOptions: {
        'MRI': 'MRI',
        'CT': 'CT',
        'CHEST_X_RAY': 'X-RAY',
        'BLOOD_TEST': 'BLOOD TEST',
        'TEXT': 'TEXT',
      },
      inputPlaceholder: 'Select report type',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a report type';
        }
        return undefined;
      }
    });
    const { value: fileStatus } = await Swal.fire({
      title: 'Select Report Status',
      input: 'select',
      inputOptions: {
        'PROCESSING' : 'PROCESSING',
        'TRANSIT' : "TRANSIT",
        'ORDERED' : "ORDERED",
        'AVAILABLE' : "AVAILABLE",
      },
      inputPlaceholder: 'Select report status',
      showCancelButton: true,
      confirmButtonText: 'Upload',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a report status';
        }
        return undefined;
      }
    });
  
    if (fileType && fileStatus) {
      console.log(fileType);
      console.log(fileStatus);
      formData.append('reportType', fileType);
      formData.append('reportStatus', fileStatus);
      if (fileType === 'MRI' || fileType === 'CT' || fileType === 'CHEST_X_RAY' || fileType === 'BLOOD_TEST') {
        // Handle image upload
        this.patientService.uploadReport(this.patient_id, formData).subscribe(
          (response) => {
            Swal.fire('Success', 'Report uploaded successfully', 'success');
          },
          (error) => {
            console.error(error);
            Swal.fire('Error', 'Failed to upload report', 'error');
          }
        );
      } else if (fileType === 'TEXT') {
        // Handle textual upload
        this.patientService.uploadTextualReport(this.patient_id, formData).subscribe(
          (response) => {
            Swal.fire('Success', 'Report uploaded successfully', 'success');
          },
          (error) => {
            console.error(error);
            Swal.fire('Error', 'Failed to upload report', 'error');
          }
        );
      }
    } else {
      Swal.fire("Error", 'Report Type or Report Status Not Selected', 'error');
    }
    
    }
}
