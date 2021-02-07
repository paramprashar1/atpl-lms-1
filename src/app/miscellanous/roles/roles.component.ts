import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roleName: string = null;
  roleId: string = null;
  updating: boolean = false;

  constructor(
    private miscs: MiscellanousService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    if ( this.miscs.roles.length == 0) {
      this.miscs.getMiscellanousDataOnCreatedDate(2)
        .subscribe(response => { this.miscs.roles = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_MISCELLANEOUS, status);
  }

  pushDataToFirestore() {
    if (this.roleName == null) {
      this.snackbar.open('Value Requried', '', {
        duration: 2500,
        panelClass: ['warning']
      });
    } else {
      let data = {};
      data['name'] = this.roleName.toLowerCase();
      data['docId'] = this.roleId == null ? this.miscs.getDocId() : this.roleId;
      data['type'] = 2;
      if (this.roleId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscs.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscs.addMiscellanousDataToFirestore(data);
            this.roleName = null;
          } else {
            this.snackbar.open('Same Entry Alreay Exists', '', {
              duration: 2500,
              panelClass: ['warning']
            });
            document.getElementById('roleName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscs.addMiscellanousDataToFirestore(data);
        this.roleName = null;
        this.roleId = null;
        this.updating = false;
      }
    }
  }

  assignValueToField(data) {
    this.updating = true;
    this.roleName = data.name;
    this.roleId = data.docId;
    document.getElementById('roleName').focus();
  }

}
