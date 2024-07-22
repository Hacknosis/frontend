import {ReportAnalysisResult, ResultAttribute, ResultEntity, Traits} from "@app/models/report-analysis-result";
import {Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {AccountService, PatientService} from "@app/services";
import {User} from "@app/models";
import {Patient} from "@app/models/patient";
import {ImageReport} from "@app/models/image-report";
import {ReportStatus} from "@app/models/report-status";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AppointmentsComponent } from '../appointments/appointments.component';
import {ReportType} from "@app/models/report-type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FeatureTextDescriptionComponent} from "@app/components/feature-text-description/feature-text-description.component";
import { ReportUploadComponent } from '../report-upload/report-upload.component';
import {ReportService} from "@app/services/report.service";
import {TextualReport} from "@app/models/textual-report";

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
  textualReports: TextualReport[] = [];
  imageReports: ImageReport[] = [];
  lastRect: { startX: number, startY: number, width: number, height: number } | null = null;
  selectedTextualReport: TextualReport | null = null;
  selectedImageReport: ImageReport | null = new ImageReport();
  processedText: SafeHtml = "";
  entities: ResultEntity[] = [];
  eventHandled: boolean[] = [];
  extraInfoDialog?: MatDialogRef<FeatureTextDescriptionComponent>;
  headerName: string[] = ['Name', 'Date', 'Report Type', 'Status'];
  imageData: HTMLImageElement | null = null;

  @ViewChild('viewer', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private startX = 0;
  private startY = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private reportService: ReportService,
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
  }

  ngOnInit(): void {
    this.readReports();
  }

  readReports() {
    this.reportService.readTextualReports(this.patient.id).subscribe(
      result => {
        this.textualReports = result;
      },
      error => {
        Swal.fire("Error", "An error occurred while fetching reports.", "error");
        this.router.navigateByUrl("/");
      }
    );
    this.reportService.readImageReports(this.patient.id).subscribe(
      result => {
        this.imageReports = result;
        console.log(result);
      },
      error => {
        Swal.fire("Error", "An error occurred while fetching reports.", "error");
        this.router.navigateByUrl("/");
      }
    );
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

  openTextualReport(report: TextualReport) {
    this.viewing = true;
    this.selectedTextualReport = report;
    this.loadAnalysisResult();
  }

  openImageReport(report: ImageReport) {
    this.viewing = true;
    this.selectedImageReport = report;

    setTimeout(() => {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.ctx.strokeStyle = "blue";
      this.ctx.lineWidth = 3;
      const encodedSeq = report.content.substring(report.content.indexOf(","));
      const decodedSeq = atob(encodedSeq);
      const byteNumbers = new Array(decodedSeq.length);
      for (let i = 0; i < decodedSeq.length; i++) {
        byteNumbers[i] = decodedSeq.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'image/png'});

      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        // Resize canvas to match image size
        this.canvas.nativeElement.width = img.width;
        this.canvas.nativeElement.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.imageData = img;
      };
      img.src = url;
    });
  }

  startDrawing(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const canvasElement = event.target as HTMLCanvasElement;
    const rect = canvasElement.getBoundingClientRect();

    this.drawing = true;
    this.startX = event.x - rect.x;
    this.startY = event.y - rect.y;
    if (this.startX < 0 || this.startY < 0) {
      this.drawing = false; return;
    }
    /*console.log(`started at (${this.startX}, ${this.startY})`);*/
    console.log(event);
    console.log(rect);

    console.log(this.startX + " " + this.startY);

    // this.ctx.strokeRect(0, 0, 100, 100);
  }

  draw(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.drawing || !this.imageData) return;

    const canvasElement = event.target as HTMLCanvasElement;
    const rect = canvasElement.getBoundingClientRect();

    const mouseX = event.x - rect.x;
    const mouseY = event.y - rect.y;

    let width = mouseX - this.startX;
    let height = mouseY - this.startY;

    console.log(`mouse currently at (${mouseX}, ${mouseY})`);
    console.log(`draw rectangle with w = ${width}, h = ${height}`);

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.ctx.drawImage(this.imageData, 0, 0);

    this.ctx.strokeRect(this.startX, this.startY, width, height);
  }

  endDrawing(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.drawing = false;
    const canvasElement = event.target as HTMLCanvasElement;
    const rect = canvasElement.getBoundingClientRect();
    const mouseX = event.x - rect.x;
    const mouseY = event.y - rect.y;

    let width = mouseX - this.startX;
    let height = mouseY - this.startY;

    this.ctx.drawImage(this.imageData!, 0, 0);

    this.ctx.strokeRect(this.startX, this.startY, width, height);

    if (this.lastRect !== null) {
      let topX = this.lastRect.startX, topY = this.lastRect.startY;
      let botX = this.lastRect.startX + this.lastRect.width, botY = this.lastRect.startY + this.lastRect.height;
      let box = [topX, topY, botX, botY];
      console.error(`box is ${box}`);
    }

    this.ctx.drawImage(this.imageData!, 0, 0);
  }

  loadAnalysisResult() {
    const entityResult: ReportAnalysisResult = JSON.parse(this.selectedTextualReport!.entityDetectionAnalysisResult.toString());
    const ontologyResult: ReportAnalysisResult = JSON.parse(this.selectedTextualReport!.entityDetectionAnalysisResult.toString());
    this.entities = entityResult.entities.concat(ontologyResult.entities);
    this.eventHandled = new Array(this.entities.length + 1).fill(false);
    let rawText = `<p style="display: inline-block; margin: 5%"> ${this.selectedTextualReport!.content} </p>`;
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
          this.reportService.uploadTextualReport(this.patient_id, formData).subscribe(
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
          this.reportService.uploadReport(this.patient_id, formData).subscribe(
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
