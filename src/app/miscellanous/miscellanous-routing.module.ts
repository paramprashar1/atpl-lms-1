import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Utils } from './../Utils/utils';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Utils.ROUTE_DEPARTMENTS
  },
  {
    path: Utils.ROUTE_DEPARTMENTS,
    component: DepartmentsComponent
  },
  {
    path: Utils.ROUTE_DESIGNATIONS,
    component: DesignationsComponent
  },
  {
    path: Utils.ROUTE_ROLES,
    component: RolesComponent
  },
  {
    path: Utils.ROUTE_STATUS,
    component: StatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellanousRoutingModule { }
