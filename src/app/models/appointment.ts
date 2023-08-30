import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";

export class Appointment {
    appointmentTime: Date = new Date();
    location: string = "";
    mainProvider: string = "";
    id: number=0;
}
