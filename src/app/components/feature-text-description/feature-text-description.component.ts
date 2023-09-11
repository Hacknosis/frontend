import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PatientService} from "@app/services";
import {FormBuilder} from "@angular/forms";
import {ResultEntity} from "@app/models/report-analysis-result";

@Component({
  selector: 'app-feature-text-description',
  templateUrl: './feature-text-description.component.html',
  styleUrls: ['./feature-text-description.component.css']
})
export class FeatureTextDescriptionComponent {
  entity: ResultEntity = new ResultEntity();
  constructor(public dialogRef: MatDialogRef<FeatureTextDescriptionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.entity = data.entity;
  }
}
