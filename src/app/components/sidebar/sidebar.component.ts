import { Component, OnInit } from '@angular/core';
import * as _utils from './../../Utils/utils';

declare interface RouteInfo {
  path: string;
  title: string;
  icons: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: `/${_utils.ROUTE_DASHBOARD}`, title: _utils.LABEL_DASHBOARD, icons: 'dashboard', class: '' },
  { path: `/${_utils.ROUTE_STAFF}`, title: _utils.LABEL_STAFF, icons: 'person', class: '' },
  { path: `/${_utils.ROUTE_STUDENTS}`, title: _utils.LABEL_STUDENTS, icons: 'groups', class: '' },
  { path: `/${_utils.ROUTE_BATCHES}`, title: _utils.LABEL_BATCHES, icons: 'school', class: '' },
  { path: `/${_utils.ROUTE_SUBJECTS}`, title: _utils.LABEL_SUBJECTS, icons: 'subject', class: '' },
  { path: `/${_utils.ROUTE_MEDIA}`, title: _utils.LABEL_MEDIA, icons: 'perm_media', class: '' },
  { path: `/${_utils.ROUTE_FEEMODULE}`, title: _utils.LABEL_FEEMODULE, icons: 'request_quote', class: '' },
  { path: `/${_utils.ROUTE_ROUTES}`, title: _utils.LABEL_ROUTES, icons: 'alt_route', class: '' },
  { path: `/${_utils.ROUTE_MISCELLANOUS}`, title: _utils.LABEL_MISCELLANOUS, icons: 'miscellaneous_services', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  title = _utils.COMPANY_NAME;

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };
}
