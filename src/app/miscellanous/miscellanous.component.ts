import { Component, OnInit } from '@angular/core';
import { Utils } from './../Utils/utils';

export interface routes {
  path: string;
  title: string;
}

export const childRoutes: routes[] = [
  { path: Utils.ROUTE_DEPARTMENTS, title: Utils.LABEL_DEPARTMENTS },
  { path: Utils.ROUTE_DESIGNATIONS, title: Utils.LABEL_DESIGNATIONS },
  { path: Utils.ROUTE_ROLES, title: Utils.LABEL_ROLES },
  { path: Utils.ROUTE_STATUS, title: Utils.LABEL_STATUS },
];

@Component({
  selector: 'app-miscellanous',
  templateUrl: './miscellanous.component.html',
  styleUrls: ['./miscellanous.component.css']
})
export class MiscellanousComponent implements OnInit {

  routesInfo: any[];

  constructor() { }

  ngOnInit(): void {
    this.routesInfo = childRoutes.filter(route => route);
  }

}
