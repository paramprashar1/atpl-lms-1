import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';

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
    private miscellanousService: MiscellanousService,
    private toast: ToastrService
  ) { } 

  ngOnInit(): void {
    if ( this.miscellanousService.designations.length == 0) {
      this.miscellanousService.getMiscellanousDataOnName(1)
        .subscribe(response => { this.miscellanousService.designations = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  pushDataToFirestore() {
    if (this.designationName == null) {
      this.toast.warning('Required Value', 'Warning')
    } else {
      let data = {};
      data['name'] = this.designationName.toLowerCase();
      data['docId'] = this.designationId == null ? this.miscellanousService.getDocId() : this.designationId;
      data['type'] = 1;
      if (this.designationId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscellanousService.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscellanousService.addMiscellanousDataToFirestore(data);
            this.designationName = null;
          } else {
            this.toast.warning('Same Entry Already Exist', 'Warning', {
              enableHtml: true,
              toastClass: "alert w-25",
              positionClass: 'toast-top-right'
            });
            document.getElementById('designationName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscellanousService.addMiscellanousDataToFirestore(data);
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
