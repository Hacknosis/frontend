import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";
import {ReportType} from "@app/models/report-type";
import {ReportStatus} from "@app/models/report-status";
import {SafeResourceUrl} from "@angular/platform-browser";

export class TestReport {
  id: number = 0;
  patient: Patient = new Patient();
  type: ReportType = ReportType.CT;
  testData: SafeResourceUrl = "";
  reportStatus: ReportStatus = ReportStatus.AVAILABLE;
  entityDetectionAnalysisResult: string = "";
  ontologyLinkingAnalysisResult: string = "";
  contentId: string = "";
  publicationId: string = "";
  date: Date = new Date();
}
