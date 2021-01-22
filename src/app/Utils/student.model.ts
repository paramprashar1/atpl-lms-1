export class Student {
    docId: string;
    name: string;
    email: string;
    mobile: string; 
    profileImage: string;
    fatherName: string;
    fatherEmail: string;
    fatherMobile: string;
    address: string;
    remarks: string;
    
    gender: number;         // 0 -> Male   | 1 -> Female    | 2 -> Other
    salutation: number;     // 0 -> Mr.    | 1 -> Prof      | 2 -> Dr..    | 3 -> Er.
    status: number;         // 0 -> Lead   | 1 -> Inpocess  | 2 -> Mature  | 3 -> inMature

    birthDate: Date;
    appointmentDate: Date;
    followUpDate: Date;

    appointmentsHistory: any[];
    
    createdOn: Date;
    updatedOn: Date;
    active: boolean;

    // optional attributes
    authId?: string;
    password?: string;
    batch?: any;                            // current batch
    previousBatches?: any[];                // previous batches
    previousBatchesHashcode?: string[];     // previous batches docId
}

/*
sub-collections: appointments, transactions(fee)
*/