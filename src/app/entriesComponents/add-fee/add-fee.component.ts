import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { FeeComponents, FeeStructure } from './../../Utils/fee-structure';
import * as _utils from './../../Utils/utils';

@Component({
  selector: 'app-add-fee',
  templateUrl: './add-fee.component.html',
  styleUrls: ['./add-fee.component.css']
})
export class AddFeeComponent implements OnInit {

  detailsArray: FeeComponents[];
  total: number = 0;
  name: string;

  constructor(
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }


  addFeeStructure() {
    if(this.name == undefined || this.name == "") {
      this.snackbar.open("First Name  Required", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      return;
    }

    if(this.detailsArray == undefined || this.detailsArray.length == 0) {
      this.snackbar.open("At least add one fee component", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      return;
    } else {
      for(let fee of this.detailsArray) {
        if(fee.name == undefined || fee.amount == undefined || fee.amount == 0) {
          this.snackbar.open("Compoennt Name is required and amount should be grater than 0", "", {
            duration: 2000,
            panelClass: ['warning']
          });
          return;
        }
      }
    }

    var docId = this.dbRef.createId();

    let feeObj: FeeStructure = {
      'docId': docId,
      'name': this.name,
      'total': this.total,
      'feeComponents': this.detailsArray,
      'createdOn': new Date(),
      'updatedOn': new Date()
    };

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_FEESTRUCTURES}`)
      .doc(docId)
      .set(feeObj, { merge: true })
      .then(() => {
        this.toast.success("Fee Structure Added", "Successfully");
        this.dialog.closeAll();
      })
      .catch((err) => this.snackbar.open(err, "", {duration: 6000}));
  }

  openFeeDialog() {
    this.dialog.open(AddFeeComponent);
  }

  calculateTotalFee() {
    this.total = 0;
    if (this.detailsArray.length != 0) {
      for (let obj of this.detailsArray) {
        this.total += obj.amount || 0;
      }
    }
  }

  addNewitem() {
    if (this.detailsArray == undefined) {
      this.detailsArray = [];
      this.detailsArray.push({ ...new FeeComponents });
    } else {
      this.detailsArray.push({ ...new FeeComponents });
    }
  }

  removeItem(idx) {
    this.detailsArray.splice(idx, 1);
    this.calculateTotalFee();
  }
}
