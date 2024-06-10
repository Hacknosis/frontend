import { Component} from '@angular/core';
import {AccountService} from "@app/services";
import { ReportService } from '@app/services/report.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { User } from '@app/models';
import Swal from "sweetalert2";
import html2canvas from 'html2canvas';
import { WorkloadComponent } from '../workload/workload.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User | null;
  issueDescription: string = '';

  constructor(public dialog: MatDialog,private accountService: AccountService,
    private reportService: ReportService, private router:Router) {
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

  openWorkload() {
    if(this.router.url === '/') {
      Swal.fire('Please select a patient.', '', 'error');
    } else {
      this.dialog.open(WorkloadComponent, {
        disableClose: true,
        width: '60%',
        height: '50%',
        data: this.user 
      });
    }   
  }

  async fileReport() {
    try {
      const canvas = await html2canvas(document.body); // capture entire viewport
      const screenshotData = canvas.toDataURL('image/png');

      const screenshotFile = this.reportService.generateFile(screenshotData);
  
      const { value: issueDescription } = await Swal.fire({
        title: 'Screenshot saved. \n Please enter the issue description.',
        input: 'text',
        inputPlaceholder: 'Type your issue description here',
        inputAttributes: {
          required: 'true'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit Issue Report',
        cancelButtonText: 'Cancel Issue Report',
        inputValidator: (value) => {
          if (!value) {
            return 'Issue description is required';
          }
          return undefined;
        }
      });
  
      if (issueDescription && this.user && this.user.id) {
        // send request to report service
        try {
          await this.reportService.sendReport(screenshotFile, issueDescription, this.formatDateTime(new Date()), this.user.id);
          Swal.fire("Success", "Report filed successfully.", "success");
        } catch (error) {
          console.log(error);
          Swal.fire("Error", "An error occurred while filing report.", "error");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An error occurred while capturing the screenshot.', 'error');
    }
  }

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
