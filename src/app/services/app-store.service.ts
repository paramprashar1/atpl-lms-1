import { Injectable } from '@angular/core';
import { Staff } from '../Utils/staff.model';
import { Student } from '../Utils/student.model';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  users: Staff[];
  students: Student[];

  constructor() {
   }
}
