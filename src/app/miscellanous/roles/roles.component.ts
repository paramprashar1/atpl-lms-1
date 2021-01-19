import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as Utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';

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
    private miscellanousService: MiscellanousService,
    private toast: ToastrService
  ) { } 

  ngOnInit(): void {
    if ( this.miscellanousService.roles.length == 0) {
      this.miscellanousService.getMiscellanousDataOnCreatedDate(2)
        .subscribe(response => { this.miscellanousService.roles = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  pushDataToFirestore() {
    if (this.roleName == null) {
      this.toast.warning('Required Value', 'Warning')
    } else {
      let data = {};
      data['name'] = this.roleName.toLowerCase();
      data['docId'] = this.roleId == null ? this.miscellanousService.getDocId() : this.roleId;
      data['type'] = 2;
      if (this.roleId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscellanousService.checkDuplicateRecord(Utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscellanousService.addMiscellanousDataToFirestore(data);
            this.roleName = null;
          } else {
            this.toast.warning('Same Entry Already Exist', 'Warning', {
              enableHtml: true,
              toastClass: "alert w-25",
              positionClass: 'toast-top-right'
            });
            document.getElementById('roleName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscellanousService.addMiscellanousDataToFirestore(data);
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
