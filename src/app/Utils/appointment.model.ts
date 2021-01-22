export class Appointment {
    docId: string;
    enquiry: string;
    remarks: string;
    status: number;             // 0 -> Lead | 1 -> In Process | 2 -> Mature | 3 -> Not Mature
    appointmentDate: Date;
    followUpDate: Date;
    createdOn: Date;
}
