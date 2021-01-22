import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MiscellanousService } from '../../services/miscellanous.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _utils from './../../Utils/utils';
import { ToastrService } from 'ngx-toastr';
import { Student } from '../../Utils/student.model';
import { DatePipe } from '@angular/common';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  updation: boolean = false;
  loading: boolean = false;

  stdObj: Student;

  docId: string;
  name: string;
  email: string;
  mobile: string;
  profileImage: any;
  fatherName: string;
  fatherEmail: string;
  fatherMobile: string;
  remarks: string;
  address: string;

  birthDate: Date;
  todaysDate: Date;
  appointmentDate: Date;
  followUpDate: Date;

  salutation: number = 0;
  gender: number = 0;
  status: number = 0;

  tempFile: File;
  datepipe: DatePipe = new DatePipe('en-us');

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddStudentComponent>,
    private miscs: MiscellanousService,
    private dbRef: AngularFirestore,
    private stgRef: AngularFireStorage,
    private snackbar: MatSnackBar,
    private toast: ToastrService
  ) {
    if (data['obj'] != null) {
      this.updation = true;
      this.stdObj = data['obj'];
      this.name = this.stdObj.name;
      this.email = this.stdObj.email;
      this.mobile = this.stdObj.mobile;
      this.gender = this.stdObj.gender;
      this.address = this.stdObj.address;
      this.birthDate = this.stdObj.birthDate;
      this.docId = this.stdObj.docId;
      this.remarks = this.stdObj.remarks;
      this.fatherName = this.stdObj.fatherName;
      this.fatherMobile = this.stdObj.fatherMobile;
      this.fatherEmail = this.stdObj.fatherEmail;
      this.salutation = this.stdObj.salutation;
      this.appointmentDate = new Date();
      if(this.stdObj.followUpDate != null){
        if(this.datepipe.transform(this.appointmentDate, 'yyyy-MM-dd') == this.datepipe.transform(this.stdObj.followUpDate['seconds'] * 1000, 'yyyy-MM-dd')) {
          this.status = 1;
        } else {
          this.status = this.stdObj.status;
        }
      }

    } else {
      this.updation = false;
      this.birthDate = new Date();
    }
  }

  ngOnInit(): void {
    this.appointmentDate = new Date();
  }

  firestoreID = () => this.dbRef.createId();

  async addStudent() {
    this.loading = true;
    if (this.name == undefined || this.name == "") {
      this.snackbar.open("First Name  Required", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.fatherName == undefined || this.fatherName == "") {
      this.snackbar.open("First Name  Required", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.address == undefined && this.address?.length <= 1) {
      this.snackbar.open("Address required", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (!this.email.includes("@") || !this.email.includes(".")) {
      this.snackbar.open("Email Invalid ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (!this.fatherEmail.includes("@") || !this.fatherEmail.includes(".")) {
      this.snackbar.open("Father Email Invalid ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.gender == undefined) {
      this.snackbar.open("Gender is required ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.birthDate == undefined) {
      this.snackbar.open("Date of Birth is required ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    var docKey = this.firestoreID();
    if(this.profileImage != undefined) {
      const file = this.profileImage;
      const path = _utils.ROUTE_STUDENTS + "/" + docKey + "/profileImage";
      const storageRef = this.stgRef.ref(path);
      const upload = this.stgRef.upload(path, file);

      await upload.snapshotChanges().pipe().toPromise().then(() => {
        return storageRef.getDownloadURL().toPromise().then(url => {
          this.profileImage = url;
        })
      })
    }

    var stdObj: Student = {
      docId: docKey,
      name: this.name.toLowerCase(),
      email: this.email.toLowerCase(),
      mobile: this.mobile,
      fatherName: this.fatherName.toLowerCase(),
      fatherEmail: this.fatherEmail.toLowerCase(),
      fatherMobile: this.fatherMobile,
      birthDate: this.birthDate || null,
      profileImage: this.profileImage || "",
      gender: this.gender,
      salutation: this.salutation,
      status: this.status,
      appointmentDate: this.appointmentDate,
      appointmentsHistory: [],
      followUpDate: this.followUpDate || null,
      address: this.address || "",
      remarks: this.remarks || "",
      active: true,
      createdOn: new Date(),
      updatedOn: new Date(),
    };
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STUDENTS).doc(docKey)
      .set(stdObj, { merge: true })
      .then(() => {
        this.toast.success("Added Successfully");
        this.loading = false;
        this.dialogRef.close();
      })
      .catch((err) => {
        console.log(">>> error: ", err);
        this.toast.error("Something Went Wrong");
        this.loading = false;
      })
  }

  updateStudent() {
    this.loading = true;
    if(this.status == 1) {
      if(this.followUpDate == null) {
        this.snackbar.open("Next Date is required ", "", {
          duration: 2000,
          panelClass: ['warning']
        });
        this.loading = false;
        return;
      }
    }
    let stdObj = {
      docId: this.docId,
      name: this.name.toLowerCase(),
      email: this.email.toLowerCase(),
      mobile: this.mobile,
      fatherName: this.fatherName.toLowerCase(),
      fatherEmail: this.fatherEmail.toLowerCase(),
      fatherMobile: this.fatherMobile,
      birthDate: this.birthDate,
      profileImage: this.profileImage || this.stdObj.profileImage,
      gender: this.gender,
      salutation: this.salutation,
      status: this.status,
      appointmentDate: this.appointmentDate,
      appointmentsHistory: firebase.default.firestore.FieldValue.arrayUnion({
        appointmentDate: this.stdObj.appointmentDate,
        followUpDate: this.stdObj.followUpDate,
        remarks: this.stdObj.remarks
      }),
      followUpDate: this.followUpDate || null,
      address: this.address,
      remarks: this.remarks,
      active: this.status == 3 ? false : this.stdObj.active,
      updatedOn: new Date(),
    };
    this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STUDENTS).doc(this.docId)
      .update(stdObj)
      .then(() => {
        this.toast.success("Updated Successfully");
        this.loading = false;
        this.dialogRef.close();
      })
      .catch((err) => {
        console.log(">>> error: ", err);
        this.toast.error("Something Went Wrong");
        this.loading = false;
      })
  }

  selectProfileImage(event) {
    var temp = event.target.files[0];
    if (
      temp.type == "image/png" ||
      temp.type == "image/jpeg" ||
      temp.type == "image/jpg"
    ) {
      this.profileImage = temp;
    } else {
      temp = null;
      this.profileImage = "";
      (<HTMLInputElement>document.getElementById("profileImage")).value = null;
      this.snackbar.open("Invalid image format. Only .png/.jpg/.jpeg file supported.", '', {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
  }

}
