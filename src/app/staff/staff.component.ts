import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddStaffComponent } from '../entriesComponents/add-staff/add-staff.component';
import { DeleteModalComponent } from '../entriesComponents/delete-modal/delete-modal.component';
import { ViewImageModalComponent } from '../entriesComponents/view-image-modal/view-image-modal.component';
import { AppStoreService } from '../services/app-store.service';
import { MiscellanousService } from '../services/miscellanous.service';
import { Staff } from '../Utils/staff.model';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  users: Staff[];
  limit: number = 10;
  previousLength: number = 0;
  moreDataLoader: boolean = false;

  constructor(
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private router: Router,
    private appStore: AppStoreService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.loadData();
    this.appStore.users = [];
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STAFF)
      .snapshotChanges()
      .subscribe(response => {
        this.appStore.users = response.map(user => ({ ...user.payload.doc.data() as Staff }));
      });
  }

  async loadData() {
    await this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STAFF, ref => ref.limit(this.limit))
      .snapshotChanges()
      .subscribe(response => {
        if (response.length == this.previousLength) {
          this.snackBar.open("No More Data Available", "", {
            duration: 3000
          });
          this.moreDataLoader = false;
        } else {
          this.appStore.users = [];
          response.forEach(user => {
            const userObj: Staff = { ...user.payload.doc.data() as Staff };
            this.appStore.users.push(userObj);
          })
          this.previousLength = this.appStore.users.length;
          this.moreDataLoader = false;
        } 
      });
  }

  changeStatus(status, docKey) {
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STAFF).doc(docKey)
      .set({ active: status }, { merge: true })
      .then(() => {
        var msg = status ? 'ACTIVE' : 'IN ACTIVE';
        this.snackBar.open("Status Changed to " + msg, "", {
          duration: 3000
        });
      })
  }

  loadMoreData() {
    this.moreDataLoader = true;
    this.limit += 10;
    this.loadData();
  }

  openModal() {
    this.dialog.open(AddStaffComponent, {
      panelClass: "addStaffDialog",
      hasBackdrop: true,
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

  showUpdateUser(docId) {
    this.router.navigate([_utils.ROUTE_USERPROFILE, docId]);
  }

  viewImage(url) {
    console.log(url);
    this.dialog.open(ViewImageModalComponent, {
      data: {
        imageUrl: url || "https://static.thenounproject.com/png/2999524-200.png"
      }
    })
  }

}
