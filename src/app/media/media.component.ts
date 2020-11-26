import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  numbers: any[];

  constructor() {
    this.numbers = Array(28).fill(1).map((x,i) => i);
   }

  ngOnInit(): void {
  }

  openAlert(text) {
    alert(text);
  }

}
