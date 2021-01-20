import { Routes } from '@angular/router';
import * as Utils from './../../Utils/utils';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { BatchesComponent } from '../../batches/batches.component';
import { MediaComponent } from '../../media/media.component';
import { MiscellanousComponent } from '../../miscellanous/miscellanous.component';
import { StaffComponent } from '../../staff/staff.component';
import { StudentsComponent } from '../../students/students.component';
import { SubjectsComponent } from '../../subjects/subjects.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

export const AdminLayoutRoutes: Routes = [
  { path: '', redirectTo: Utils.ROUTE_DASHBOARD, pathMatch: 'full' },
  { path: Utils.ROUTE_DASHBOARD, component: DashboardComponent },
  { path: Utils.ROUTE_STAFF, component: StaffComponent },
  { path: Utils.ROUTE_STUDENTS, component: StudentsComponent },
  { path: Utils.ROUTE_BATCHES, component: BatchesComponent },
  { path: Utils.ROUTE_SUBJECTS, component: SubjectsComponent },
  { path: Utils.ROUTE_MEDIA, component: MediaComponent },
  {
    path: Utils.ROUTE_MISCELLANOUS, component: MiscellanousComponent,
    children: [{ path: '', loadChildren: './../../miscellanous/miscellanous.module#MiscellanousModule' }]
  },
  { path: Utils.ROUTE_USERPROFILE + "/:docId", component: UserProfileComponent }
];
