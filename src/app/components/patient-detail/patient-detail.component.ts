import {ReportAnalysisResult, ResultAttribute, ResultEntity, Traits} from "@app/models/report-analysis-result";
import {Component, OnInit, AfterViewChecked, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {AccountService, PatientService} from "@app/services";
import {User} from "@app/models";
import {Patient} from "@app/models/patient";
import {TestReport} from "@app/models/test-report";
import {ReportStatus} from "@app/models/report-status";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AppointmentsComponent } from '../appointments/appointments.component';
import {ReportType} from "@app/models/report-type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FeatureTextDescriptionComponent} from "@app/components/feature-text-description/feature-text-description.component";
import { ReportUploadComponent } from '../report-upload/report-upload.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
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
  selectedReport: TestReport = new TestReport();
  processedText: SafeHtml = "";
  entities: ResultEntity[] = [];
  eventHandled: boolean[] = [];
  extraInfoDialog?: MatDialogRef<FeatureTextDescriptionComponent>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private patientService: PatientService,
              private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private elementRef: ElementRef) {

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
    /*this.patientService.readReports(this.patient_id).subscribe((res) => {
      this.availableReports = res.filter(v => v.reportStatus === ReportStatus.AVAILABLE);
      this.pendingReports = res.filter(v => v.reportStatus !== ReportStatus.AVAILABLE);
    }, (error) => {
      Swal.fire('Error when reading report', error.errors[0],'error').then(r => {
        router.navigateByUrl("/");
      });
    });*/
  }

  ngOnInit(): void {
    // this.loadBravaScript();
    // this.loadBravaViewer();
  }

  ngAfterViewChecked() {
    /*for (let i = 1; i <= this.entities.length; i++) {
      if (!this.eventHandled[i] && this.elementRef.nativeElement.querySelector(`#feature-text-${i}`)) {
        this.elementRef.nativeElement
          .querySelector(`#feature-text-${i}`)
          .addEventListener("mouseover", (event: MouseEvent) => this.showExtraInfo(this.entities[i - 1], event));

        this.elementRef.nativeElement
          .querySelector(`#feature-text-${i}`)
          .addEventListener("mouseout", () => this.closeExtraInfo());

        this.eventHandled[i] = true;
      }
    }*/
  }

  closeExtraInfo() {
    this.extraInfoDialog?.close();
  }

  openReport(report: TestReport) {
    this.viewing = true;
    this.selectedReport = report;
    if (report.type === ReportType.TEXT) {
      this.loadAnalysisResult();
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

  loadAnalysisResult() {
    const entityResult: ReportAnalysisResult = JSON.parse(this.selectedReport.entityDetectionAnalysisResult.toString());
    const ontologyResult: ReportAnalysisResult = JSON.parse(this.selectedReport.entityDetectionAnalysisResult.toString());
    this.entities = entityResult.entities.concat(ontologyResult.entities);
    this.eventHandled = new Array(this.entities.length + 1).fill(false);
    let rawText = `<p style="display: inline-block; margin: 5%"> ${this.selectedReport.content} </p>`;
    let idx = 1;
    this.entities.forEach((entity) => {
      rawText = rawText.replace(
        new RegExp(entity.text, 'gi'),
        (match) => {
          return `<strong id="feature-text-${idx++}" >${match}</strong>`;
        }
      );
    });
    this.processedText = this.sanitizer.bypassSecurityTrustHtml(rawText);
  }

  showExtraInfo(val: ResultEntity, event: MouseEvent): void {
    this.extraInfoDialog = this.dialog.open(FeatureTextDescriptionComponent, {
      disableClose: false,
      position: { top: event.clientY + 10 + 'px', left: event.clientX + 'px' },
      width: '20%',
      height: '10%',
      data: { entity: val }
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
/*
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
*/

  async uploadFile(file: any) {
    const selectedFile = file.files[0];
    const formData = new FormData();
    formData.append('report', selectedFile);

    const dialogRef = this.dialog.open(ReportUploadComponent, {
      disableClose: true,
      data: {
        patient_id: this.patient_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        formData.append('reportType', result.reportType);
        formData.append('reportStatus', result.reportStatus);

        if (result.reportType === "TEXT") {
          // Handle textual upload
          this.patientService.uploadTextualReport(this.patient_id, formData).subscribe(
            (response) => {
              Swal.fire('Success', 'Report uploaded successfully', 'success');
            },
            (error) => {
              console.error(error);
              Swal.fire('Error', 'Failed to upload report - ' + error.error, 'error');
            }
          );
        } else {
          // Handle image upload (MRI, CT, CHEST_X_RAY, BLOOD_TEST)
          this.patientService.uploadReport(this.patient_id, formData).subscribe(
            (response) => {
              Swal.fire('Success', 'Report uploaded successfully', 'success');
            },
            (error) => {
              console.error(error);
              Swal.fire('Error', 'Failed to upload report - ' + error.error, 'error');
            }
          );
        }
      } else {
        Swal.fire('Error', 'Report Type or Report Status Not Selected', 'error');
      }
    });
  }
  public returnToList() {
    this.router.navigateByUrl('');
  }
}
