import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiscellanousRoutingModule } from './miscellanous-routing.module';
import { RolesComponent } from './roles/roles.component';
import { StatusComponent } from './status/status.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [RolesComponent, StatusComponent, DepartmentsComponent, DesignationsComponent],
  imports: [
    CommonModule,
    MiscellanousRoutingModule,
    FormsModule,
    MaterialModule
  ]
})
export class MiscellanousModule { }
