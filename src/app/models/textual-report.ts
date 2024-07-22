import {Patient} from "@app/models/patient";
import {ReportType} from "@app/models/report-type";
import {ReportStatus} from "@app/models/report-status";
import {ReportAnalysisResult} from "@app/models/report-analysis-result";

export class TextualReport {
  id: number = 0;
  patient: Patient = new Patient();
  reportStatus: ReportStatus = ReportStatus.AVAILABLE;
  content: string = "";
  entityDetectionAnalysisResult: ReportAnalysisResult = new ReportAnalysisResult();
  ontologyLinkingAnalysisResult: ReportAnalysisResult = new ReportAnalysisResult();
  date: Date = new Date();
}
