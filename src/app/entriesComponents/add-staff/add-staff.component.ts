import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Staff } from '../../Utils/staff.model';
import { MiscellanousService } from '../../services/miscellanous.service';
import { Experience } from '../../Utils/experience.model';
import { Qualification } from '../../Utils/qualification.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import * as _utils from '../../Utils/utils';
import { ToastrService } from 'ngx-toastr';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {

  staff: Staff;
  qual: Qualification;
  exps: Experience;

  qualifications: Qualification[];
  finalQualification: any[];

  experiences: Experience[];
  finalExperiences: any[];

  startDate: Date;
  endDate: Date;
  loading: boolean = false;
  // dialog: any;

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  birthDate: Date;
  department: any;
  designation: any;
  profileImage: any;

  role: number = 1;
  gender: number;
  salutation: number;

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private miscs: MiscellanousService,
    private dbRef: AngularFirestore,
    private authRef: AngularFireAuth,
    private storageRef: AngularFireStorage,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.passGen();
  }

  emailGen = (event) => this.email = event.target.value.split(" ").join(".").toLowerCase().concat("@gmail.com") || null;
  passGen = () => this.password = Math.random().toString(20).substr(2, 8);
  docId = () => this.dbRef.createId();

  async addStaff(): Promise<any> {
    this.loading = true;
    if (this.firstName == undefined || this.firstName == "") {
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
      this.snackbar.open("Invalid Email ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.email.substr(0, this.email.indexOf('@gmail.com')) == "") {
      this.snackbar.open("Invalid Username in Email ", "", {
        duration: 2000,
        panelClass: ['warning']
      });
      this.loading = false;
      return;
    }

    if (this.role == undefined && this.role == null) {
      this.snackbar.open("Please Select Role", "", {
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

    if (this.role == 1) {
      if (this.department == undefined && this.department == null) {
        this.snackbar.open("Please Select Department", "", {
          duration: 2000,
          panelClass: ['warning']
        });
        this.loading = false;
        return;
      }
      if (this.designation == undefined && this.designation == null) {
        this.snackbar.open("Please Select Designation", "", {
          duration: 2000,
          panelClass: ['warning']
        });
        this.loading = false;
        return;
      }
    }

    if (this.qualifications != undefined) {
      for (let qual of this.qualifications) {
        if (qual.qualificationName == "" || qual.qualificationYear == "" || qual.certificate == null) {
          this.snackbar.open("Qualification Name, Year and Certificate Image Required", '', {
            duration: 2500,
            panelClass: ['warning']
          });
          this.loading = false;
          return;
        } else {
          this.qualifications[this.qualifications.findIndex(x => x == qual)].certificateImageUrl = "";
        }
      }
    }

    if (this.experiences != undefined) {
      for (let exp of this.experiences) {
        if (exp.currentOccupation) {
          this.experiences[this.experiences.findIndex(x => x == exp)].endDate = new Date();
        }
        if (exp.experienceName == "" || exp.startDate == null || exp.endDate == null || exp.certificate == null) {
          this.snackbar.open("Organisation Name, Start Date, End Date and Certificate Image Required", '', {
            duration: 2500,
            panelClass: ['warning']
          });
          this.loading = false;
          return;
        } else {
          this.experiences[this.experiences.findIndex(x => x == exp)].certificateImageUrl = "";
        }
      }
    }

    this.authRef.createUserWithEmailAndPassword(this.email, this.password)
      .then(async (auth) => {
        var documentId = this.docId();
        await this.uploadImages(documentId);
        await this.correction();
        var userObject = {
          fname: this.firstName?.toLowerCase(),
          lname: this.lastName?.toLowerCase() || "",
          mobile: this.mobile || "",
          email: this.email,
          password: this.password,
          address: this.address,
          docId: documentId,
          authId: auth.user.uid,
          active: true,
          birthDate: this.birthDate || null,
          department: this.role == 1 ? this.department['name'] : "",
          designation: this.role == 1 ? this.designation['name'] : "",
          experiences: this.finalExperiences,
          qualifications: this.finalQualification,
          gender: this.gender,
          salutation: this.salutation,
          role: this.role,
          createdOn: new Date(),
          updatedOn: new Date(),
          token: "",
          lastLogin: null,
          profileImage: this.profileImage || ""
        };

        this.dbRef.collection(_utils.MAIN).doc(_utils.MAIN).collection(_utils.COLLECTION_STAFF).doc(documentId)
          .set(userObject, { merge: true })
          .then(() => this.toast.success("Staff Added", "Successfully"));
        this.loading = false;
        this.dialog.closeAll();
      })
      .catch((error) => {
        this.snackbar.open(error.message, "", {
          duration: 3000,
        });
        this.loading = false;
        // return;
      });
  }

  async uploadImages(docId) {
    if (this.profileImage != undefined) {
      const file = this.profileImage;
      const fileName = this.profileImage.name;
      const path = _utils.ROUTE_STAFF + "/" + docId + "/profileImage";
      const storageRef = this.storageRef.ref(path);
      const upload = this.storageRef.upload(path, file);

      await upload.snapshotChanges().pipe().toPromise().then(() => {
        return storageRef.getDownloadURL().toPromise().then(url => {
          this.profileImage = url;
        })
      })
    }

    if (this.qualifications != undefined) {
      for (let qual of this.qualifications) {
        const file = qual.certificate;
        const path = _utils.ROUTE_STAFF + "/" + docId + "/" + _utils.ROUTE_QUALIFICATION + "/" + qual.certificate.name;
        const storageRef = this.storageRef.ref(path);
        const upload = this.storageRef.upload(path, file);

        await upload.snapshotChanges().pipe().toPromise().then(() => {
          return storageRef.getDownloadURL().toPromise().then(url => {
            this.qualifications[this.qualifications.findIndex(x => x == qual)].certificateImageUrl = url;
            this.qualifications[this.qualifications.findIndex(x => x == qual)].certificate = null;
          });
        });
      }
    }

    if (this.experiences != undefined) {
      for (let qual of this.experiences) {
        const file = qual.certificate;
        const path = _utils.ROUTE_STAFF + "/" + docId + "/" + _utils.ROUTE_EXPERIENCES + "/" + qual.certificate.name;
        const storageRef = this.storageRef.ref(path);
        const upload = this.storageRef.upload(path, file);
        await upload.snapshotChanges().pipe().toPromise().then(() => {
          return storageRef.getDownloadURL().toPromise().then(url => {
            this.experiences[this.experiences.findIndex(x => x == qual)].certificateImageUrl = url;
            this.experiences[this.experiences.findIndex(x => x == qual)].certificate = null;
          });
        });
      }
    }
  }

  correction() {
    if (this.qualifications != undefined) {
      this.finalQualification = [];
      for (let qual of this.qualifications) {
        this.finalQualification.push({
          qualificationName: qual.qualificationName,
          qualificationYear: qual.qualificationYear,
          certificateImageUrl: qual.certificateImageUrl
        });
      }
    }

    if (this.experiences != undefined) {
      this.finalExperiences = [];
      for (let qual of this.experiences) {
        this.finalExperiences.push({
          experienceName: qual.experienceName,
          startDate: qual.startDate,
          endDate: qual.endDate,
          currentOccupation: qual.currentOccupation,
          certificateImageUrl: qual.certificateImageUrl
        });
      }
    }
  }

  addQualification() {
    let obj: Qualification = new Qualification();
    obj.qualificationName = "";
    obj.qualificationYear = "";
    obj.certificate = null;
    obj.certificateImageUrl = "";

    if (this.qualifications == undefined) {
      this.qualifications = [];
      this.qualifications.push(obj);
    } else {
      this.qualifications.push(obj);
    }
  }

  addExperience() {
    let obj: Experience = new Experience();
    obj.experienceName = "";
    obj.certificate = null;
    obj.certificateImageUrl = "";
    obj.currentOccupation = false;
    obj.startDate = null;
    obj.endDate = null;

    if (this.experiences == undefined) {
      this.experiences = [];
      this.experiences.push(obj);
    } else {
      this.experiences.push(obj);
    }
  }

  addProfileImage(event) {
    var tempFile = event.target.files[0];
    if (
      tempFile.type == "image/png" ||
      tempFile.type == "image/jpeg" ||
      tempFile.type == "image/jpg"
    ) {
      this.profileImage = tempFile;
    } else {
      tempFile = null;
      this.profileImage = "";
      (<HTMLInputElement>document.getElementById("profileImage")).value = null;
      this.snackbar.open("Invalid image format. Only .png/.jpg/.jpeg file supported.", '', {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
  }

  addQualImage(event, index) {
    var tempFile = event.target.files[0];
    if (
      tempFile.type == "image/png" ||
      tempFile.type == "image/jpeg" ||
      tempFile.type == "image/jpg"
    ) {
      this.qualifications[index].certificate = tempFile;
    } else {
      tempFile = null;
      (<HTMLInputElement>document.getElementById('img' + index)).value = null;
      this.snackbar.open("Invalid image format. Only .png/.jpg/.jpeg file supported.", '', {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
  }

  addExpImage(event, index) {
    var tempFile = event.target.files[0];
    if (
      tempFile.type == "image/png" ||
      tempFile.type == "image/jpeg" ||
      tempFile.type == "image/jpg"
    ) {
      this.experiences[index].certificate = tempFile;
    } else {
      tempFile = null;
      (<HTMLInputElement>document.getElementById('exp' + index)).value = null;
      this.snackbar.open("Invalid image format. Only .png/.jpg/.jpeg file supported.", '', {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    }
  }

  printQual() {
    if (this.qualifications == undefined) {
      this.snackbar.open("Please add one qualification", '', {
        duration: 2500,
        panelClass: ['warning']
      });
      return;
    } else {
      for (let qual of this.qualifications) {
        if (qual.qualificationName == "" || qual.qualificationYear == "" || qual.certificate == undefined) {
          this.snackbar.open("Qualification Name, Year and Certificate Image Required", '', {
            duration: 2500,
            panelClass: ['warning']
          });
          return;
        } else {
          this.qualifications[this.qualifications.findIndex(x => x == qual)].certificateImageUrl = "";
        }
      }
      console.log(this.qualifications);
    }

  }

  removeQualification(index) {
    this.qualifications.splice(index, 1);
  }

  removeExperience(index) {
    this.experiences.splice(index, 1);
  }

  close() {
    this.dialog.closeAll();
  }

}
