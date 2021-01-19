import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from '../Utils/miscellanous.model';
import * as Utils from '../Utils/utils';

@Injectable({
  providedIn: 'root'
})
export class MiscellanousService {

  departments: Miscellanous[] = [];
  designations: Miscellanous[] = [];
  roles: Miscellanous[] = [];
  status: Miscellanous[] = [];

  constructor(
    private dbRef: AngularFirestore,
    private toast: ToastrService
  ) {
    console.log(">>> Testing");


    this.getMiscellanousDataOnName(0)
      .subscribe(response => { this.departments = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousDataOnName(1)
      .subscribe(response => { this.designations = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousDataOnCreatedDate(2)
      .subscribe(response => { this.roles = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousDataOnCreatedDate(3)
      .subscribe(response => { this.status = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });
  }

  getDocId = () => (this.dbRef.createId());

  checkDuplicateRecord(collectionName: string, key: any, value: any) {
    return this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(collectionName, ref => ref.where(key, '==', value))
      .get().toPromise();
  }

  addMiscellanousDataToFirestore(data) {
    this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(data.docId)
      .set(data, { merge: true })
      .then(() => this.toast.success('Changes Done', 'Success'))
      .catch(err => this.toast.warning('', 'Something Went Wrong'));
  }

  deleteData(docId) {
    this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(docId)
      .delete()
      .then(() => this.toast.success('', 'Deleted Successfully'))
      .catch(err => this.toast.warning('', 'Something Went Wrong'));
  }

  updateActiveStatus(docId, status) {
    this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(docId)
      .update({ active: status })
      .then(() => this.toast.success('Active Status Updated', 'Success'))
      .catch(err => this.toast.warning('', 'Something Went Wrong'));
  }

  getMiscellanousDataOnCreatedDate(type: number): any {
    return this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_MISCELLANEOUS, ref => ref.where('type', '==', type).orderBy('createdOn', 'asc')).snapshotChanges();
  }

  getMiscellanousDataOnName(type: number): any {
    return this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_MISCELLANEOUS, ref => ref.where('type', '==', type).orderBy('name', 'asc')).snapshotChanges();
  }
}
