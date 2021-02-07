import { Experience } from "./experience.model";
import { Qualification } from "./qualification.model";

export class Staff {
    docId: string;
    authId: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    profileImage: string;
    address: string;
    department: string;
    designation: string;
    token: string;
    password: string;

    gender: number;          // 0 -> Male   | 1 -> Female | 2 -> Other
    salutation: number;      // 0 -> Dr.    | 1 -> Mr.    | 2 -> Mrs.         | 3 -> Ms.        | 4 -> Prof.  | 5 -> Er.
    role: number;            // 0 -> Admin  | 1 -> Staff  | 2 -> Receptionist | 3 -> Accountant

    qualifications: Qualification[];
    experiences: Experience[];
    
    active?: boolean;
    
    birthDate: Date;
    lastLogin: Date;
    createdOn: Date;
    updatedOn: Date;
}
