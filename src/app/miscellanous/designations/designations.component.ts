import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {

  designationName: string = null;
  designationId: string = null;
  updating: boolean = false;

  constructor(
    private miscs: MiscellanousService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if ( this.miscs.designations.length == 0) {
      this.miscs.getMiscellanousDataOnName(1)
        .subscribe(response => { this.miscs.designations = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_MISCELLANEOUS, status);
  }

  pushDataToFirestore() {
    if (this.designationName == null) {
      this.snackbar.open('Value Requried', '', {
        duration: 2500,
        panelClass: ['warning']
      });
    } else {
      let data = {};
      data['name'] = this.designationName.toLowerCase();
      data['docId'] = this.designationId == null ? this.miscs.getDocId() : this.designationId;
      data['type'] = 1;
      if (this.designationId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscs.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscs.addMiscellanousDataToFirestore(data);
            this.designationName = null;
          } else {
            this.snackbar.open('Same Entry Alreay Exists', '', {
              duration: 2500,
              panelClass: ['warning']
            });
            document.getElementById('designationName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscs.addMiscellanousDataToFirestore(data);
        this.designationName = null;
        this.designationId = null;
        this.updating = false;
      }
    }
  }

  assignValueToField(data) {
    this.updating = true;
    this.designationName = data.name;
    this.designationId = data.docId;
    document.getElementById('designationName').focus();
  }

}
