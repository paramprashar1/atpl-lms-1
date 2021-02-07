import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddFeeComponent } from '../entriesComponents/add-fee/add-fee.component';
import { DeleteModalComponent } from '../entriesComponents/delete-modal/delete-modal.component';
import { AppStoreService } from '../services/app-store.service';
import { MiscellanousService } from '../services/miscellanous.service';
import { FeeStructure } from '../Utils/fee-structure.model';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-fee-module',
  templateUrl: './fee-module.component.html',
  styleUrls: ['./fee-module.component.css']
})
export class FeeModuleComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public appStore: AppStoreService,
    private dbRef: AngularFirestore,
    private miscs: MiscellanousService
  ) { }

  ngOnInit(): void {
    if (this.appStore.feeStructures.length == 0) {
      this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_FEESTRUCTURES}`, ref => ref.orderBy('createdOn', 'desc'))
      .snapshotChanges()
      .subscribe((response) => {
        this.appStore.feeStructures = response.map(e => ({ ...e.payload.doc.data() as FeeStructure }));
      })
    }
  }

  deleteFeeStructure(docId) {
    this.dialog.open(DeleteModalComponent, {
      data: {
        'docId': docId,
        'collection': _utils.COLLECTION_FEESTRUCTURES
      }
    });
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_FEESTRUCTURES, status);
  }

  openFeeDialog(type: string, feeObj?) {
    switch(type) {
      case "ADD": {
        this.dialog.open(AddFeeComponent, {
          data: {
            'feeObj': null,
            'viewing': false
          }
        });
        break;
      }
      case "UPDATE": {
        this.dialog.open(AddFeeComponent, {
          data: {
            'feeObj': feeObj,
            'viewing': false
          }
        });
        break;
      }
      case "VIEW": {
        this.dialog.open(AddFeeComponent, {
          data: {
            'feeObj': feeObj,
            'viewing': true
          }
        });
        break;
      }
    }

  }

}
