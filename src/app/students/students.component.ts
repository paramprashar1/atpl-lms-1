import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddStudentComponent } from '../entriesComponents/add-student/add-student.component';
import { AppStoreService } from '../services/app-store.service';
import { Student } from '../Utils/student.model';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  leadCount: number;
  inProcessCount: number;
  matureCount: number;
  notMatureCount: number;

  constructor(
    private appStore: AppStoreService,
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.appStore.students = [];
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STUDENTS)
      .snapshotChanges()
      .subscribe(response => {
        this.appStore.students = response.map(e => ({ ...e.payload.doc.data() as Student }));
        this.leadCount = this.appStore.students.filter(x => x.status == 0).length;
        this.inProcessCount = this.appStore.students.filter(x => x.status == 1).length;
        this.matureCount = this.appStore.students.filter(x => x.status == 2).length;
        this.notMatureCount = this.appStore.students.filter(x => x.status == 3).length;
        // response.forEach(std => {
        //   const stdObj = { ...std.payload.doc.data() as Student };
        //   this.appStore.students.push(stdObj);
        // });
      });
  }

  changeStatus(status, docKey) {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STUDENTS).doc(docKey)
      .set({ active: status }, { merge: true })
      .then(() => {
        var msg = status ? 'ACTIVE' : 'IN ACTIVE';
        this.snackBar.open("Status Changed to " + msg, "", {
          duration: 3000
        });
      })
  }

  openAddStudentModal() {
    this.dialog.open(AddStudentComponent, {
      data: {
        obj: null
      },
      panelClass: "studentDialog"
    });
  }

  openUpdateModal(obj) {
    this.dialog.open(AddStudentComponent, {
      data: {
        obj: obj
      },
      panelClass: "studentDialog"
    });
  }

}
