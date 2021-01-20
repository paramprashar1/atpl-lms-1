import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as _utils from './../Utils/utils';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: _utils.ROUTE_DEPARTMENTS
  },
  {
    path: _utils.ROUTE_DEPARTMENTS,
    component: DepartmentsComponent
  },
  {
    path: _utils.ROUTE_DESIGNATIONS,
    component: DesignationsComponent
  },
  {
    path: _utils.ROUTE_ROLES,
    component: RolesComponent
  },
  {
    path: _utils.ROUTE_STATUS,
    component: StatusComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscellanousRoutingModule { }
