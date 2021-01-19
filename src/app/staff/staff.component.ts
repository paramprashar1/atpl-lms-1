import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStaffComponent } from '../entriesComponents/add-staff/add-staff.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this.dialog.open(AddStaffComponent, {
      panelClass: "addStaffDialog",
      hasBackdrop: true,
    });
  }

}
