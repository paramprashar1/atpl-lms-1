import { Component, OnInit } from '@angular/core';
import * as _utils from './../Utils/utils';

export interface routes {
  path: string;
  title: string;
}

export const childRoutes: routes[] = [
  { path: _utils.ROUTE_DEPARTMENTS, title: _utils.LABEL_DEPARTMENTS },
  { path: _utils.ROUTE_DESIGNATIONS, title: _utils.LABEL_DESIGNATIONS },
  { path: _utils.ROUTE_ROLES, title: _utils.LABEL_ROLES },
  { path: _utils.ROUTE_STATUS, title: _utils.LABEL_STATUS },
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
