import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from '../Utils/miscellanous.model';
import { Utils } from '../Utils/utils';

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

    this.getMiscellanousData(0)
      .subscribe(response => { this.departments = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousData(1)
      .subscribe(response => { this.designations = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousData(2)
      .subscribe(response => { this.roles = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });

    this.getMiscellanousData(3)
      .subscribe(response => { this.status = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) });
  }

  getDocId = () => (this.dbRef.createId());

  checkDuplicateRecord(collectionName: string, key: any, value: any) {
    return this.dbRef.collection(collectionName, ref => ref.where(key, '==', value))
      .get().toPromise();
  }

  addMiscellanousDataToFirestore(data) {
    this.dbRef.collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(data.docId)
      .set(data, { merge: true })
      .then(() => this.toast.success('Changes Done', 'Success', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }))
      .catch(err => this.toast.warning('', 'Something Went Wrong', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }));
  }

  deleteData(docId) {
    this.dbRef.collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(docId)
      .delete()
      .then(() => this.toast.success('', 'Deleted Successfully', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }))
      .catch(err => this.toast.warning('', 'Something Went Wrong', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }));
  }

  updateActiveStatus(docId, status) {
    this.dbRef.collection(Utils.COLLECTION_MISCELLANEOUS)
      .doc(docId)
      .update({ active: status })
      .then(() => this.toast.success('Active Status Updated', 'Success', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }))
      .catch(err => this.toast.warning('', 'Something Went Wrong', {
        enableHtml: false,
        toastClass: 'alert w-25',
        positionClass: 'toast-top-right'
      }));
  }

  getMiscellanousData(type: number): any {
    return this.dbRef.collection(Utils.COLLECTION_MISCELLANEOUS, ref => ref.where('type', '==', type).orderBy('name', 'asc')).snapshotChanges();
  }
}
