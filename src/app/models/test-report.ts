import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";
import {ReportType} from "@app/models/report-type";
import {ReportStatus} from "@app/models/report-status";
import {SafeResourceUrl} from "@angular/platform-browser";
import {ReportAnalysisResult} from "@app/models/report-analysis-result";

export class TestReport {
  id: number = 0;
  patient: Patient = new Patient();
  type: ReportType = ReportType.CT;
  reportStatus: ReportStatus = ReportStatus.AVAILABLE;
  content: string = "";
  entityDetectionAnalysisResult: ReportAnalysisResult = new ReportAnalysisResult();
  ontologyLinkingAnalysisResult: ReportAnalysisResult = new ReportAnalysisResult();
  contentId: string = "";
  publicationId: string = "";
  date: Date = new Date();
}
