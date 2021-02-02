import { Injectable } from '@angular/core';
import { FeeStructure } from '../Utils/fee-structure';
import { Staff } from '../Utils/staff.model';
import { Student } from '../Utils/student.model';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  users: Staff[];
  students: Student[];
  feeStructures: FeeStructure[];

  constructor() {
   }
}
