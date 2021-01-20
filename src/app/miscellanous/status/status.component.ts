import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Miscellanous } from './../../Utils/miscellanous.model';
import * as _utils from './../../Utils/utils';
import { MiscellanousService } from './../../services/miscellanous.service';

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
    private miscellanousService: MiscellanousService,
    private toast: ToastrService
  ) { } 

  ngOnInit(): void {
    if ( this.miscellanousService.status.length == 0) {
      this.miscellanousService.getMiscellanousDataOnName(3)
        .subscribe(response => { this.miscellanousService.status = response.map(e => ({ ...e.payload.doc.data() as Miscellanous })) })
    }
  }

  pushDataToFirestore() {
    if (this.statusName == null) {
      this.toast.warning('Required Value', 'Warning')
    } else {
      let data = {};
      data['name'] = this.statusName.toLowerCase();
      data['docId'] = this.statusId == null ? this.miscellanousService.getDocId() : this.statusId;
      data['type'] = 3;
      if (this.statusId == null) {
        data['createdOn'] = new Date();
        data['updatedOn'] = new Date();
        data['active'] = true;
        this.miscellanousService.checkDuplicateRecord(_utils.COLLECTION_MISCELLANEOUS, 'name', data['name'])
        .then(response => {
          if (response.size == 0) {
            this.miscellanousService.addMiscellanousDataToFirestore(data);
            this.statusName = null;
          } else {
            this.toast.warning('Same Entry Already Exist', 'Warning', {
              enableHtml: true,
              toastClass: "alert w-25",
              positionClass: 'toast-top-right'
            });
            document.getElementById('statusName').focus();
          }
        });
      } else {
        data['updatedOn'] = new Date();
        this.miscellanousService.addMiscellanousDataToFirestore(data);
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
