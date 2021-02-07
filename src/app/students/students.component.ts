import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddStudentComponent } from '../entriesComponents/add-student/add-student.component';
import { DeleteModalComponent } from '../entriesComponents/delete-modal/delete-modal.component';
import { AppStoreService } from '../services/app-store.service';
import { MiscellanousService } from '../services/miscellanous.service';
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
    public appStore: AppStoreService,
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private miscs: MiscellanousService
  ) { }

  ngOnInit(): void {
    // this.appStore.students = [];
    this.fetchStudents();
  }

  fetchStudents() {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STUDENTS, ref => ref.orderBy('status').orderBy('name', 'asc'))
      .snapshotChanges()
      .subscribe(response => {
        this.appStore.students = response.map(e => ({ ...e.payload.doc.data() as Student }));
        this.leadCount = this.appStore.students.filter(x => x.status == 0).length;
        this.inProcessCount = this.appStore.students.filter(x => x.status == 1).length;
        this.matureCount = this.appStore.students.filter(x => x.status == 2).length;
        this.notMatureCount = this.appStore.students.filter(x => x.status == 3).length;
      });
  }

  changeStatus(status, docKey) {
    this.miscs.updateActiveStatus(docKey, _utils.COLLECTION_STAFF, status);
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

  openDeleteModal(docId) {
    this.dialog.open(DeleteModalComponent, {
      data: {
        docId: docId,
        collection: _utils.COLLECTION_STAFF
      },
      width: '400px',
      panelClass: 'deleteModal'
    });
  }

}
