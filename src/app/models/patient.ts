import {ResusStatus} from "./resus-status";
import {Indicator} from "./indicator";
import {Appointment} from "./appointment";

export class Patient {
  id: number = 0;
  name: string = "";
  summary: string = "";
  age: number = 0;
  sex: string = "";
  allergies: string[] = [];
  room: number = 0;
  resusStatus: ResusStatus = ResusStatus.ComfortCare;
  specialIndicators: Indicator[] = [];
  appointments: Appointment = new Appointment();
}
