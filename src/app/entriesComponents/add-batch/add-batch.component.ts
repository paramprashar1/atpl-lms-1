import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _utils from './../../Utils/utils';
import { Batch } from './../../Utils/batch.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-batch',
  templateUrl: './add-batch.component.html',
  styleUrls: ['./add-batch.component.css']
})
export class AddBatchComponent implements OnInit {

  name: string;
  year: string;
  startingDate: Date;
  endingDate: Date;
  description: string;

  today: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<AddBatchComponent>,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }


  addBatch() {
    if (this.name == undefined || this.name == "") {
      this.snackbar.open("Batch Name Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }
    if (this.year == undefined || this.year == "") {
      this.snackbar.open("Batch Year Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }
    if (this.startingDate == undefined || this.startingDate == null) {
      this.snackbar.open("Batch Starting Date Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }
    if (this.endingDate == undefined || this.endingDate == null) {
      this.snackbar.open("Batch Ending Date Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }

    let docKey = this.dbRef.createId();
    let batchObj: Batch = {
      docId: docKey,
      batchName: this.name.toLowerCase(),
      batchYear: this.year,
      description: this.description || null,
      startingDate: this.startingDate,
      endingDate: this.endingDate,
      numberOfStudents: 0,
      currentSemesterHashcode: null,
      semesterLists: [],
      createdOn: new Date(),
      updatedOn: new Date()
    }

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`)
      .doc(docKey)
      .set(batchObj, { merge: true })
      .then(() => {
        this.dialogRef.close();
        this.snackbar.open('Batch Added Successfully', '', {
          duration: 2500,
          panelClass: ['success']
        });
      })
      .catch((err) => {
        this.snackbar.open('Something went wrong!! Please try againg.', '', {
          duration: 2500,
          panelClass: ['warning']
        });
      })
  }

}
