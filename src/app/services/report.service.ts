import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  captureScreenshot(targetElement: HTMLElement): Promise<string> {
    return html2canvas(targetElement).then(canvas => {
      return canvas.toDataURL('image/png');
    });
  }

  prepareReport(description: string, screenshotDataUrl: string): any {
    return {
      description: description,
      screenshot: screenshotDataUrl,
      timestamp: new Date().toISOString()
    };
  }

  sendReport(reportData: any): Promise<any> {
    const apiUrl = `${environment.apiUrl}/report`;
    return this.httpClient.post(apiUrl, reportData).toPromise();
  }
}
