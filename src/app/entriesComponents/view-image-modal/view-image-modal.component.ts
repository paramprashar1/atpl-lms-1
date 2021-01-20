import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-image-modal',
  templateUrl: './view-image-modal.component.html',
  styleUrls: ['./view-image-modal.component.css']
})
export class ViewImageModalComponent implements OnInit {

  imageUrl : string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.imageUrl = data['imageUrl'];
   }

  ngOnInit(): void {
  }

}
