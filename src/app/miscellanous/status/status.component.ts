import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  statusName: string = null;
  statusId: string = null;
  updating: boolean = false;

  constructor(
    private miscs: MiscellanousService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if ( this.miscs.status.length == 0) {
      this.miscs.getMiscellanousDataOnName(3)
        .subscribe(response => { this.miscs.status = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_MISCELLANEOUS, status);
  }

  pushDataToFirestore() {
    if (this.statusName == null) {
      this.snackbar.open('Value Requried', '', {
        duration: 2500,
        panelClass: ['warning']
      });
    } else {
      let data = {};
      data['name'] = this.statusName.toLowerCase();
      data['docId'] = this.statusId == null ? this.miscs.getDocId() : this.statusId;
      data['type'] = 3;
      if (this.statusId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscs.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscs.addMiscellanousDataToFirestore(data);
            this.statusName = null;
          } else {
            this.snackbar.open('Same Entry Alreay Exists', '', {
              duration: 2500,
              panelClass: ['warning']
            });
            document.getElementById('statusName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscs.addMiscellanousDataToFirestore(data);
        this.statusName = null;
        this.statusId = null;
        this.updating = false;
      }
    }
  }

  assignValueToField(data) {
    this.updating = true;
    this.statusName = data.name;
    this.statusId = data.docId;
    document.getElementById('statusName').focus();
  }

}
