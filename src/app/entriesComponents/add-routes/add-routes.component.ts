import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _utils from './../../Utils/utils';
import { Routes } from './../../Utils/routes.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-routes',
  templateUrl: './add-routes.component.html',
  styleUrls: ['./add-routes.component.css']
})
export class AddRoutesComponent implements OnInit {

  docId: string;
  // name: string;
  from: string;
  to: string;
  fee: number;
  createdOn: Date;

  updating: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddRoutesComponent>,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar,
    private toast: ToastrService
  ) {
    this.updating = data['updating'];
    if (data['route'] != null) {
      // this.name = data['route']['name'];
      this.from = data['route']['from'];
      this.to = data['route']['to'];
      this.fee = data['route']['fee'];
      this.docId = data['route']['docId'];
      this.createdOn = data['route']['createdOn'];
    }
  }

  ngOnInit(): void {
  }

  submitRoute() {
    // if (this.name == undefined || this.name == "") {
    //   this.snackbar.open("Route Name Required", "", {
    //     duration: 2000,
    //     panelClass: ['warning']
    //   });
    //   return;
    // }
    if (this.from == undefined || this.from == "") {
      this.snackbar.open("Starting Point Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }
    if (this.to == undefined || this.to == "") {
      this.snackbar.open("Ending Point Required", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }

    if (this.fee == undefined || this.fee == 0) {
      this.snackbar.open("Route Fee Required or Route fee greater than 0", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      return;
    }

    let docKey = this.docId || this.dbRef.createId();
    let routeObj: Routes = {
      'docId': docKey,
      'name': this.from.toLowerCase() + "-" + this.to.toLowerCase(),
      'from': this.from.toLowerCase(),
      'to': this.to.toLowerCase(),
      'fee': this.fee,
      'createdOn': this.updating ? this.createdOn : new Date() ,
      'updateOn': new Date()
    };

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_ROUTES}`)
      .doc(docKey)
      .set(routeObj, { merge: true })
      .then(() => {
        this.dialogRef.close();
        this.snackbar.open('Changes Done Successfully', '', {
          duration: 2500,
          panelClass: ['success']
        });
      })
  }

}
