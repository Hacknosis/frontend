import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-upload',
  templateUrl: './report-upload.component.html',
  styleUrls: ['./report-upload.component.css'],
})
export class ReportUploadComponent {
  reportTypes: string[] = [
    'MRI',
    'CT',
    'CHEST_X_RAY',
    'BLOOD_TEST',
    'TEXT',
  ];

  reportStatuses: string[] = [
    'PROCESSING',
    'TRANSIT',
    'ORDERED',
    'AVAILABLE',
  ];

  selectedReportType: string | undefined;
  selectedReportStatus: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ReportUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmUpload(): void {
    if (this.selectedReportType && this.selectedReportStatus) {
      this.dialogRef.close({
        reportType: this.selectedReportType,
        reportStatus: this.selectedReportStatus,
      });
    }
  }
}