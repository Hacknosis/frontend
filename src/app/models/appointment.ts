import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";

export class Appointment {
    appointment_time: Date = new Date();
    location: string = "";
    main_provider: string = "";
    id: number=0;
}
