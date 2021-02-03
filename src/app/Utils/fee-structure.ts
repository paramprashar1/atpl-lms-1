export class FeeComponents {
    name: string;
    amount: number;
}

export class FeeStructure {
    docId: string;
    name: string;
    feeComponents: FeeComponents[];
    total: number;
    active: boolean;
    createdOn: Date;
    updatedOn: Date;
}
