import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { environment as dev } from './../environments/environment';
import { environment as prod } from './../environments/environment.prod';
import { MiscellanousService } from './services/miscellanous.service';
import { MaterialModule } from './material.module';
import { DeleteModalComponent } from './entriesComponents/delete-modal/delete-modal.component';
import { ViewImageModalComponent } from './entriesComponents/view-image-modal/view-image-modal.component';
import { AppStoreService } from './services/app-store.service';
import { AddStaffComponent } from './entriesComponents/add-staff/add-staff.component';
import { AddStudentComponent } from './entriesComponents/add-student/add-student.component';
import { AddFeeComponent } from './entriesComponents/add-fee/add-fee.component';
import { AddRoutesComponent } from './entriesComponents/add-routes/add-routes.component';
import { AddBatchComponent } from './entriesComponents/add-batch/add-batch.component';
import { AddSemesterComponent } from './entriesComponents/add-semester/add-semester.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,

    // Dialogs Component
    ViewImageModalComponent,
    DeleteModalComponent,
    AddStaffComponent,
    AddStudentComponent,
    AddFeeComponent,
    AddRoutesComponent,
    AddBatchComponent,
    AddSemesterComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    NgbModule,
    AppRoutingModule,
    // AngularFireModule.initializeApp(prod.firebaseConfig),
    AngularFireModule.initializeApp(dev.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      toastClass: 'alert w-25',
      positionClass: "toast-top-right",
    }),
    MaterialModule,
  ],
  entryComponents: [
    DeleteModalComponent,
    ViewImageModalComponent,
    AddFeeComponent,
    AddStaffComponent,
    AddStudentComponent,
    AddRoutesComponent,
    AddBatchComponent,
    AddSemesterComponent
  ],
  providers: [
    AppStoreService,
    MiscellanousService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
