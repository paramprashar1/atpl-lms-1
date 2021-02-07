import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AddRoutesComponent } from '../entriesComponents/add-routes/add-routes.component';
import { DeleteModalComponent } from '../entriesComponents/delete-modal/delete-modal.component';
import { AppStoreService } from '../services/app-store.service';
import { MiscellanousService } from '../services/miscellanous.service';
import { Routes } from '../Utils/routes.modal';
import * as _utils from './../Utils/utils';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private appStore: AppStoreService,
    private miscs: MiscellanousService
  ) { }

  ngOnInit(): void {
    if (this.appStore.busRoutes.length == 0) {
      this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_ROUTES}`)
      .snapshotChanges()
      .subscribe(response => {
        this.appStore.busRoutes = response.map(route => ({ ...route.payload.doc.data() as Routes }))
      })
    }
  }

  openDialog(type, routeObj?) {
    if (type == 'UPDATE') {
      this.dialog.open(AddRoutesComponent, {
        width: "300px",
        data: {
          'route': routeObj,
          'updating': true
        }
      });
    } else {
      this.dialog.open(AddRoutesComponent, {
        width: "300px",
        data: {
          'route': null,
          'updating': false
        }
      });
    }
  }

  deleteRoute(docId) {
    this.dialog.open(DeleteModalComponent, {
      data: {
        'docId': docId,
        'collection': _utils.COLLECTION_ROUTES
      }
    });
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_ROUTES, status);
  }

}
