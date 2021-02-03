import { Routes } from '@angular/router';
import * as _utils from './../../Utils/utils';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { BatchesComponent } from '../../batches/batches.component';
import { MediaComponent } from '../../media/media.component';
import { MiscellanousComponent } from '../../miscellanous/miscellanous.component';
import { StaffComponent } from '../../staff/staff.component';
import { StudentsComponent } from '../../students/students.component';
import { SubjectsComponent } from '../../subjects/subjects.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { FeeModuleComponent } from '../../fee-module/fee-module.component';
import { RoutesComponent } from '../../routes/routes.component';

export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: _utils.ROUTE_DASHBOARD, pathMatch: 'full' },
  { path: _utils.ROUTE_DASHBOARD, component: DashboardComponent },
  { path: _utils.ROUTE_STAFF, component: StaffComponent },
  { path: _utils.ROUTE_STUDENTS, component: StudentsComponent },  
  { path: _utils.ROUTE_BATCHES, component: BatchesComponent },
  { path: _utils.ROUTE_SUBJECTS, component: SubjectsComponent },
  { path: _utils.ROUTE_MEDIA, component: MediaComponent },
  {
    path: _utils.ROUTE_MISCELLANOUS, component: MiscellanousComponent,
    children: [{ path: '', loadChildren: './../../miscellanous/miscellanous.module#MiscellanousModule' }]
  },
  { path: _utils.ROUTE_USERPROFILE + "/:docId", component: UserProfileComponent },
  { path: _utils.ROUTE_FEEMODULE, component: FeeModuleComponent },
  { path: _utils.ROUTE_ROUTES, component: RoutesComponent }
];
