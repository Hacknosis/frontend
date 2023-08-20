import {Patient} from "@app/models/patient";

export class User {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    extension?: string;
    patients?: Patient[];
}
