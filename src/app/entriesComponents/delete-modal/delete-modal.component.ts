import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _utils from './../../Utils/utils';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  docId: string;
  collection: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    private dbRef: AngularFirestore,
    private stRef: AngularFireStorage,
    private snackBar: MatSnackBar
  ) {
    this.docId = data['docId'];
    this.collection = data['collection']
  }

  ngOnInit(): void {
  }

  async deleteDocument() {
    // Deleting Images from Firebase Storage uploaded by users
    switch (this.collection) {
      case _utils.COLLECTION_STAFF: {
        await this.stRef.ref(_utils.ROUTE_STAFF + "/" + this.docId).listAll()
          .toPromise()
          .then(stgItem => {
            // deleting items from firebase storage
            stgItem.items.forEach(item => {
              this.stRef.ref(item.fullPath).delete();
            });

            // deleting items of sub-folders from firebase storage
            stgItem.prefixes.forEach(item => {
              item.listAll()
                .then(event => event.items.forEach(e => this.stRef.ref(e.fullPath).delete()));
            })
          });
        break;
      }
    }

    // Deleting User Details from Firebase Firestore
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(this.collection).doc(this.docId)
      .delete()
      .then(() => {
        this.dialogRef.close();
        this.snackBar.open(this.collection.split(_utils.HYPHEN)[0].toUpperCase() + " Deleted Successfully", "", {
          duration: 6000
        });
      });
  }
}
