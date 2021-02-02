import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { BatchesComponent } from '../../batches/batches.component';
import { MediaComponent } from '../../media/media.component';
import { MiscellanousComponent } from '../../miscellanous/miscellanous.component';
import { StaffComponent } from '../../staff/staff.component';
import { StudentsComponent } from '../../students/students.component';
import { SubjectsComponent } from '../../subjects/subjects.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from '../../material.module';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { FeeModuleComponent } from '../../fee-module/fee-module.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StudentsComponent,
    BatchesComponent,
    SubjectsComponent,
    MediaComponent,
    MiscellanousComponent,
    StaffComponent,
    UserProfileComponent,
    FeeModuleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot(),
    MaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminLayoutModule {}
