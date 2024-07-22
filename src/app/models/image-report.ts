import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";
import {ReportType} from "@app/models/report-type";
import {ReportStatus} from "@app/models/report-status";
import {SafeResourceUrl} from "@angular/platform-browser";
import {ReportAnalysisResult} from "@app/models/report-analysis-result";

export class ImageReport {
  id: number = 0;
  patient: Patient = new Patient();
  reportType: ReportType = ReportType.CT;
  reportStatus: ReportStatus = ReportStatus.AVAILABLE;
  reportName: string = "";
  date: Date = new Date();
  content: string = "";
}
