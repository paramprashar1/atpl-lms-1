import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Batch, Semester } from '../Utils/batch.model';
import { FeeStructure } from '../Utils/fee-structure.model';
import { Routes } from '../Utils/routes.modal';
import { Staff } from '../Utils/staff.model';
import { Student } from '../Utils/student.model';
import * as _utils from './../Utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  users: Staff[];
  students: Student[];
  feeStructures: FeeStructure[];
  busRoutes: Routes[];
  batches: Batch[];
  semesters: Semester[];

  constructor(
    private dbRef: AngularFirestore
  ) {
    this.getFeeStructures();
    this.getRoutes();
  }


  getFeeStructures() {
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_FEESTRUCTURES}`, ref => ref.orderBy('createdOn', 'desc'))
      .snapshotChanges()
      .subscribe((response) => {
        this.feeStructures = response.map(e => ({ ...e.payload.doc.data() as FeeStructure }));
      })
  }

  getRoutes() {
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_ROUTES}`)
      .snapshotChanges()
      .subscribe(response => {
        this.busRoutes = response.map(route => ({ ...route.payload.doc.data() as Routes }))
      })
  }
}
