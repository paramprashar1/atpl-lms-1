import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from '../Utils/miscellanous.model';
import * as _utils from '../Utils/utils';

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
    private snackbar: MatSnackBar,
  ) {
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

  updateActiveStatus(docId, collection, status) {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(collection)
      .doc(docId)
      .set({ active: status }, { merge: true })
      .then(() => this.snackbar.open('Active Status Updated Successfully', '', {
        duration: 2500,
        panelClass: ['success']
      }))
      .catch(err => this.snackbar.open('Something went wrong!! Please try againg.', '', {
          duration: 2500,
          panelClass: ['warning']
        }));
  }


  checkDuplicateRecord(collectionName: string, key: any, value: any) {
    return this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(collectionName, ref => ref.where(key, '==', value))
      .get().toPromise();
  }

  addMiscellanousDataToFirestore(data) {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_MISCELLANEOUS)
      .doc(data.docId)
      .set(data, { merge: true })
      .then(() => this.snackbar.open('Changes Done Successfully', '', {
        duration: 2500,
        panelClass: ['success']
      }))
      .catch(err => this.snackbar.open('Something went wrong!! Please try againg.', '', {
          duration: 2500,
          panelClass: ['warning']
        }));
  }

  deleteData(docId) {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_MISCELLANEOUS)
      .doc(docId)
      .delete()
      .then(() => this.snackbar.open('Deleted Successfully', '', {
        duration: 2500,
        panelClass: ['success']
      }))
      .catch(err => this.snackbar.open('Something went wrong!! Please try againg.', '', {
          duration: 2500,
          panelClass: ['warning']
        }));
  }

  getMiscellanousDataOnCreatedDate(type: number): any {
    return this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_MISCELLANEOUS, ref => ref.where('type', '==', type).orderBy('createdOn', 'asc')).snapshotChanges();
  }

  getMiscellanousDataOnName(type: number): any {
    return this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_MISCELLANEOUS, ref => ref.where('type', '==', type).orderBy('name', 'asc')).snapshotChanges();
  }
}
