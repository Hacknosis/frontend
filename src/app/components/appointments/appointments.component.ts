import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from '@app/models/patient';
import { Appointment } from '@app/models/appointment';
import { PatientService } from "@app/services";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from "sweetalert2";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent {
  patient: Patient = new Patient();
  appointments: Appointment[] = [];
  headers: string[] = ["Appointment Time", "Main Provider", "Location","Actions"];
  addMode = false;
  form: FormGroup;
  newAppointment: Appointment = new Appointment();

  constructor(public dialogRef: MatDialogRef<AppointmentsComponent>,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.patient = data.patient;
      this.appointments = this.patient.appointments;
      console.log(this.appointments);
      this.form = this.formBuilder.group({
        location: ['', Validators.required],
        mainProvider: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  createAppointment(): void {
    this.addMode = true;
  }

  saveNewAppointment(): void {
    if (this.form.valid) {
      const maxId = this.appointments.reduce((max, appointment) => Math.max(max, appointment.id), -1);
      const newId = maxId + 1;
      const selectedTime = this.form.value.time;
      // Splitting the time from AM/PM
      const timeParts = selectedTime.split(' ');
      const time = timeParts[0];
      const meridiem = timeParts[1];
      // Splitting the time into hours and minutes
      const timeComponents = time.split(':');
      let hour = parseInt(timeComponents[0], 10);
      const minute = parseInt(timeComponents[1], 10);
      // Adjusting hours for 12-hour format
      if (meridiem === 'PM' && hour !== 12) {
        hour += 12;
      } else if (meridiem === 'AM' && hour === 12) {
        hour = 0;
      }
      // Datepicker toggler fields
      const selectedDate = new Date(this.form.value.date);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();

      this.newAppointment.id = newId;
      this.newAppointment.location = this.form.value.location;
      this.newAppointment.mainProvider = this.form.value.mainProvider;
      this.newAppointment.appointmentTime = new Date(year, month, day, hour, minute);
      console.log(this.newAppointment);

      this.patientService.createAppointment(this.patient.id, this.newAppointment).subscribe(
        response => {
          this.newAppointment = response;
          Swal.fire("Success", "Appointment created successfully", "success").then(r => {
            this.patient.appointments.push(this.newAppointment);
            this.addMode = false;
          });
        },
        error => {
          console.error("Error creating appointment:", error);
          Swal.fire("Create Error", "The appointment cannot be created", "error");
        }
      );
    } else {
      Swal.fire("Form Invalid", "Please enter a valid appointment", "error");
    }
  }

  cancelCreate(): void {
    this.addMode = false;
    this.form.reset();
  }

  deleteAppointment(appointmentId: number) {
    if (confirm("Are you sure you want to delete this appointment?")) {
      this.patientService.deleteAppointment(appointmentId)
        .subscribe(
          response => {
            console.log(response); 
            if (response === "Appointment deleted") {
              Swal.fire("Success", "Appointment deleted successfully", "success").then(r => {
                this.appointments = this.appointments.filter(appointment => appointment.id !== appointmentId);
                this.patient.appointments = this.patient.appointments.filter(appointment => appointment.id !== appointmentId);
              });
            } else {
              Swal.fire("Error", "An error occurred while deleting the appointment", "error");
            }
          },
          error => {
            console.error("Error deleting appointment:", error);
            Swal.fire('Delete Error', 'The appointment is not deleted', 'error');
          }
        );
    } else {
      Swal.fire('Cancel Delete', 'The appointment is not deleted', 'error');
    }
  }
}
