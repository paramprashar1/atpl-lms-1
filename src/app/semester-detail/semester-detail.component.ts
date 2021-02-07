import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-semester-detail',
  templateUrl: './semester-detail.component.html',
  styleUrls: ['./semester-detail.component.css']
})
export class SemesterDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {
    console.log(">>> sem route: ", route.queryParams['value']['batchKey']);
    
   }

  ngOnInit(): void {
  }

}
