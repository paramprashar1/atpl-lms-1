import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddBatchComponent } from '../entriesComponents/add-batch/add-batch.component';
import { AppStoreService } from '../services/app-store.service';
import { MiscellanousService } from '../services/miscellanous.service';
import { Batch } from '../Utils/batch.model';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private dbRef: AngularFirestore,
    public appStore: AppStoreService,
    private miscs: MiscellanousService
  ) { }

  ngOnInit(): void {
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_BATCHES}`)
      .snapshotChanges()
      .subscribe((response) => {
        this.appStore.batches = response.map(e => ({ ...e.payload.doc.data() as Batch }));
        console.log(">>>", this.appStore.batches);

      })
  }

  openDialog() {
    this.dialog.open(AddBatchComponent);
  }

  readMore(docId) {
    this.router.navigate(['./', docId], { relativeTo: this.route });
  }

  changeStatus(status, docId) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_BATCHES, status);
  }

}
