export class FeeComponents {
    name: string;
    amount: number;
}

export class FeeStructure {
    docId: string;
    name: string;
    feeComponents: FeeComponents[];
    total: number;

    createdOn: Date;
    updatedOn: Date;
}
