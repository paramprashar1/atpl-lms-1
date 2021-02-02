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
import { AddStaffComponent } from './entriesComponents/add-staff/add-staff.component';
import { DeleteModalComponent } from './entriesComponents/delete-modal/delete-modal.component';
import { ViewImageModalComponent } from './entriesComponents/view-image-modal/view-image-modal.component';
import { AppStoreService } from './services/app-store.service';
import { AddStudentComponent } from './entriesComponents/add-student/add-student.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { AddFeeComponent } from './entriesComponents/add-fee/add-fee.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    StudentProfileComponent,

    // Dialogs Component
    AddStaffComponent,
    AddStudentComponent,
    AddFeeComponent,
    DeleteModalComponent,
    ViewImageModalComponent,
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
    AddFeeComponent,
    AddStaffComponent,
    AddStudentComponent,
    DeleteModalComponent,
    ViewImageModalComponent,
  ],
  providers: [
    AppStoreService,
    MiscellanousService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
