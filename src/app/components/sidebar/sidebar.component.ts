import { Component, OnInit } from '@angular/core';
import * as Utils from './../../Utils/utils';

declare interface RouteInfo {
  path: string;
  title: string;
  icons: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: `/${Utils.ROUTE_DASHBOARD}`, title: Utils.LABEL_DASHBOARD, icons: 'dashboard', class: '' },
  { path: `/${Utils.ROUTE_STAFF}`, title: Utils.LABEL_STAFF, icons: 'person', class: '' },
  { path: `/${Utils.ROUTE_STUDENTS}`, title: Utils.LABEL_STUDENTS, icons: 'groups', class: '' },
  { path: `/${Utils.ROUTE_BATCHES}`, title: Utils.LABEL_BATCHES, icons: 'school', class: '' },
  { path: `/${Utils.ROUTE_SUBJECTS}`, title: Utils.LABEL_SUBJECTS, icons: 'subject', class: '' },
  { path: `/${Utils.ROUTE_MEDIA}`, title: Utils.LABEL_MEDIA, icons: 'perm_media', class: '' },
  { path: `/${Utils.ROUTE_MISCELLANOUS}`, title: Utils.LABEL_MISCELLANOUS, icons: 'miscellaneous_services', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  title = Utils.COMPANY_NAME;

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
