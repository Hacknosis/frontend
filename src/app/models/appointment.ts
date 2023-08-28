import {User} from "@app/models/user";
import {Patient} from "@app/models/patient";

export class Appointment {
    date: Date = new Date();
    location: string = "";
    main_provider: string = "";
    id: number=0;
}
