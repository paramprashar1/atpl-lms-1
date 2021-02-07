import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSemesterComponent } from '../entriesComponents/add-semester/add-semester.component';
import { Batch, Semester } from '../Utils/batch.model';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.css']
})
export class BatchDetailComponent implements OnInit {

  docId: string;
  name: string;
  year: string;
  startingDate: Date = new Date();
  endingDate: Date = new Date();
  description: string;
  numberOfStudents: number;

  semesters: Semester[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(res => {
      this.docId = res['docId'];
    })

    await this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`)
      .doc(this.docId)
      .collection(_utils.COLLECTION_SEMESTERS)
      .snapshotChanges()
      .subscribe(response => {
        this.semesters = response.map(sem => ({ ...sem.payload.doc.data() as Semester }));
      })

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`)
      .doc(this.docId)
      .get()
      .toPromise()
      .then(value => {
        let batchObj: Batch = value.data() as Batch;
        this.name = batchObj.batchName;
        this.year = batchObj.batchYear;
        this.startingDate = batchObj.startingDate;
        this.endingDate = batchObj.endingDate;
        this.description = batchObj.description;
        this.numberOfStudents = batchObj.numberOfStudents;
      })
  }

  updateBatchInformation() {
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`)
      .doc(this.docId)
      .update({
        batchName: this.name.toLowerCase(),
        batchYear: this.year,
        startingDate: this.startingDate,
        endingDate: this.endingDate,
        description: this.description || null
      })
      .then(() => this.snackbar.open("Qualification Updated Successfully", "", {
        duration: 2500,
        panelClass: ['success']
      }))
      .catch((err) => {
        console.log(err);
        this.snackbar.open("Something went wrong !! Please try again", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      });
  }

  openSemesterModal() {
    this.dialog.open(AddSemesterComponent, {
      data: {
        'batchId': this.docId,
        'batchName': this.name
      },
    })
  }
}
