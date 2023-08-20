import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";
import {ReportType} from "@app/models/report-type";
import {ReportStatus} from "@app/models/report-status";

export class TestReport {
  id: number = 0;
  user: User = new User();
  patient: Patient = new Patient();
  type: ReportType = ReportType.CT;
  testData: string = "";
  reportStatus: ReportStatus = ReportStatus.AVAILABLE;
  analysisResult: string = "";
}
