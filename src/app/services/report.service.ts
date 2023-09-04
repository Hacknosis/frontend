import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  imageExtensionMapping: Map<string, string> = new Map<string, string>();

  constructor(private httpClient: HttpClient) {
    this.imageExtensionMapping.set("/", "jpg");
    this.imageExtensionMapping.set("i", "png");
    this.imageExtensionMapping.set("R", "gif");
    this.imageExtensionMapping.set("U", "webp");
    this.imageExtensionMapping.set("J", "pdf");
   }

  captureScreenshot(targetElement: HTMLElement): Promise<string> {
    return html2canvas(targetElement).then(canvas => {
      return canvas.toDataURL('image/png');
    });
  }

  sendReport(issue: File, issueDescription: string, timestamp: string, userID: string): Promise<any> {
    const apiUrl = `${environment.apiUrl}/issue/report_ticket`;
    const reportData = new FormData();
    reportData.append('issue', issue);
    reportData.append('issueDescription', issueDescription);
    reportData.append('timestamp', timestamp);
    reportData.append('reporterID', userID)
    return this.httpClient.post(apiUrl, reportData, {responseType: 'text'}).toPromise();
  }

  generateFile(encodedSeq: string): File {
    const base64Data = encodedSeq.split(',')[1];
    const decodedSeq = atob(base64Data);
    const byteNumbers = new Array(decodedSeq.length);
    const fileType = this.imageExtensionMapping.get(encodedSeq.charAt(0));
    for (let i = 0; i < decodedSeq.length; i++) {
        byteNumbers[i] = decodedSeq.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], "Screenshot.png", {type: fileType});
  }
}
