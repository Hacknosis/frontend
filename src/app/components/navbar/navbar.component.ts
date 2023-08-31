import { Component,ElementRef } from '@angular/core';
import {AccountService} from "@app/services";
import { ReportService } from '@app/services/report.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { User } from '@app/models';
import Swal from "sweetalert2";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User | null;
  issueDescription: string = '';

  constructor(public dialog: MatDialog,private accountService: AccountService,
    private reportService: ReportService, private elementRef: ElementRef) {
    this.user = this.accountService.userValue;
  }
  logout() {
    this.accountService.logout();
  }

  openUserProfile() {
    this.dialog.open(UserProfileComponent, {
      disableClose: true,
      width: '30%',
      height: '60%',
      data: this.user 
    });
  }

  async fileReport() {
    const screenshotData = await this.reportService.captureScreenshot(this.elementRef.nativeElement);
    // May update on reportData to manually enter issue description
    const reportData = this.reportService.prepareReport('Report issued', screenshotData);
    console.log(reportData);
    //send request to report service
    try {
      await this.reportService.sendReport(reportData);
      Swal.fire("Success", "Report filed successfully.", "success");
    } catch (error) {
      Swal.fire("Error", "An error occurred while filing report.", "error");
    }
  }
}
