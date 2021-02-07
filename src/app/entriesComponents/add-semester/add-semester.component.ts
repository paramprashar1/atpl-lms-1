import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeeStructure } from '../../Utils/fee-structure.model';
import { AppStoreService } from '../../services/app-store.service';
import { AddFeeComponent } from '../add-fee/add-fee.component';
import { Semester } from '../../Utils/batch.model';
import * as firebase from 'firebase/app';
import * as _utils from './../../Utils/utils';

@Component({
  selector: 'app-add-semester',
  templateUrl: './add-semester.component.html',
  styleUrls: ['./add-semester.component.css']
})
export class AddSemesterComponent implements OnInit {

  name: string;
  batchName: string;
  batchId: string;
  feeStructure: FeeStructure;
  startingDate: Date;
  endingDate: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddSemesterComponent>,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private dbRef: AngularFirestore,
    public appStore: AppStoreService,
  ) {
    this.batchName = data['batchName'];
    this.batchId = data['batchId'];
  }

  ngOnInit(): void {
  }

  openFeeModal(event) {
    this.dialog.open(AddFeeComponent, {
      data: {
        'feeObj': this.feeStructure,
        'viewing': true
      }
    });
    event.stopPropagation();
  }


  addSemester() {
    if (this.name == undefined || this.name == "") {
      this.snackbar.open("Semester Name Required", "", {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
    if (this.startingDate == undefined || this.startingDate == null) {
      this.snackbar.open("Semester Starting Date Required", "", {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
    if (this.endingDate == undefined || this.endingDate == null) {
      this.snackbar.open("Semester Ending Date Required", "", {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
    if (this.feeStructure == undefined) {
      this.snackbar.open("Fee Structure Required", "", {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }

    let docKey = this.dbRef.createId();

    let semObj: Semester = {
      docId: docKey,
      semesterName: this.name.toLowerCase(),
      semesterNumber: null,
      batchName: this.batchName,
      batchId: this.batchId,
      staringDate: this.startingDate,
      endingDate: this.endingDate,
      currentSemester: false,
      totalFee: 0,
      recievedFee: 0,
      remaininFee: 0,
      feeStructure: {
        docId: this.feeStructure.docId,
        name: this.feeStructure.name,
        fee: this.feeStructure.total
      },
      subjectLists: [],
      previousFeeStructures: [],
      createdOn: new Date(),
      updatedOn: new Date()
    }

    let batch = this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`);
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}/${this.batchId}/${_utils.COLLECTION_SEMESTERS}`)
      .doc(docKey)
      .set(semObj, { merge: true })
      .then(async () => {
        await batch.doc(this.batchId).update({
          semesterLists: firebase.default.firestore.FieldValue.arrayUnion(docKey)
        });
        this.dialogRef.close();
        this.snackbar.open('Batch Added Successfully', '', {
          duration: 2500,
          panelClass: ['success']
        });
      })
      .catch((err) => {
        console.log(">>> err", err);

        this.snackbar.open('Something went wrong!! Please try againg.', '', {
          duration: 2500,
          panelClass: ['warning']
        })
      });
  }
}
