import { FeeStructure } from "./fee-structure.model";

export class subject {
  docId: string;
  subjectName: string;
  subjectCode: string;
  subjectImage: string;
  description: string;

  batchName: string;
  batchId: string;
  semesterId: string;
  semesterName: string;

  staffId: string;
  staffName: string;
  optional: boolean;

  active?: boolean;
  createdOn: Date;
  updatedOn: Date;
}

export class Semester {
  docId: string;
  semesterName: string;
  semesterNumber: string;

  batchName: string;
  batchId: string;

  staringDate: Date;
  endingDate: Date;
  totalFee: number;
  recievedFee: number;
  remaininFee: number;

  feeStructure: any;
  previousFeeStructures: FeeStructure[];
  subjectLists: string[];

  currentSemester: boolean;
  active?: boolean;
  createdOn: Date;
  updatedOn: Date;
}

export class Batch {
  docId: string;
  batchName: string;
  batchYear: string;
  startingDate: Date;
  endingDate: Date;
  numberOfStudents: number;

  batchImage?: string;
  description: string;

  // currentSemester: Semester;
  // previousSemesters: Semester[];
  currentSemesterHashcode: string;
  semesterLists: string[];
  // previousSemestersHashcode: string[];

  active?: boolean;
  createdOn: Date;
  updatedOn: Date;
}
