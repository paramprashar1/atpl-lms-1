import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  departmentName: string = null;
  departmentId: string = null;
  updating: boolean = false;

  constructor(
    private miscs: MiscellanousService,
    private toast: ToastrService
  ) { } 

  ngOnInit(): void {
    if ( this.miscs.departments.length == 0) {
      this.miscs.getMiscellanousDataOnName(0)
        .subscribe(response => { this.miscs.departments = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  updateActiveStatus(docId, status) {
    this.miscs.updateActiveStatus(docId, _utils.COLLECTION_MISCELLANEOUS, status);
  }

  pushDataToFirestore() {
    if (this.departmentName == null) {
      this.toast.warning('Required Value', 'Warning')
    } else {
      let data = {};
      data['name'] = this.departmentName.toLowerCase();
      data['docId'] = this.departmentId == null ? this.miscs.getDocId() : this.departmentId;
      data['type'] = 0;
      if (this.departmentId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscs.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscs.addMiscellanousDataToFirestore(data);
            this.departmentName = null;
          } else {
            this.toast.warning('Same Entry Already Exist', 'Warning', {
              enableHtml: true,
              toastClass: "alert w-25",
              positionClass: 'toast-top-right'
            });
            document.getElementById('departmentName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscs.addMiscellanousDataToFirestore(data);
        this.departmentName = null;
        this.departmentId = null;
        this.updating = false;
      }
    }
  }

  assignValueToField(data) {
    this.updating = true;
    this.departmentName = data.name;
    this.departmentId = data.docId;
    document.getElementById('departmentName').focus();
  }

}
