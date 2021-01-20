import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddStaffComponent } from '../entriesComponents/add-staff/add-staff.component';
import { DeleteModalComponent } from '../entriesComponents/delete-modal/delete-modal.component';
import { ViewImageModalComponent } from '../entriesComponents/view-image-modal/view-image-modal.component';
import { MiscellanousService } from '../services/miscellanous.service';
import { Staff } from '../Utils/staff.model';
import * as Utils from './../Utils/utils';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  users: Staff[];

  constructor(
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dbRef.collection(Utils.MAIN).doc(Utils.MAIN).collection(Utils.COLLECTION_STAFF)
      .snapshotChanges()
      .subscribe(response => {
        this.users = response.map(e => ({ ...e.payload.doc.data() as Staff}));
        console.log(">>> Users", this.users);
        
      })
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
        collection: Utils.COLLECTION_STAFF
      },
      width: '400px',
      panelClass: 'deleteModal'
    });
  }

  showUpdateUser(docId) {
    this.router.navigate([Utils.ROUTE_USERPROFILE, docId]);
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
