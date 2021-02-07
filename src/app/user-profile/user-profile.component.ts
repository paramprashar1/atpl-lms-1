import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MiscellanousService } from '../services/miscellanous.service';
import { Experience } from '../Utils/experience.model';
import { Qualification } from '../Utils/qualification.model';
import { Staff } from '../Utils/staff.model';
import * as _utils from './../Utils/utils';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  documentId: string;
  user: Staff;

  qualifications: Qualification[];
  experiences: Experience[];

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  birthDate: Date = new Date();
  department: any;
  designation: any;
  profileImage: any;
  profileImageUrl: string;

  role: number = 1;
  gender: number;
  salutation: number;

  date: Date;
  personalInformationLoader: boolean = false;
  qualificationLoader: boolean = false;
  experiencesLoader: boolean = false;

  constructor(
    private dbRef: AngularFirestore,
    private storageRef: AngularFireStorage,
    public miscs: MiscellanousService,
    private router: ActivatedRoute,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit(): Promise<any> {
    this.date = new Date();
    this.router.params.subscribe(res => {
      this.documentId = res['docId'];
    });
    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_STAFF}`).doc(this.documentId)
      .snapshotChanges()
      .subscribe(val => {
        this.user = val.payload.data() as Staff;
        this.firstName = this.user.fname;
        this.lastName = this.user.lname;
        this.address = this.user.address;
        this.department = this.user.department;
        this.designation = this.user.designation;
        this.salutation = this.user.salutation;
        this.gender = this.user.gender;
        this.experiences = this.user.experiences;
        this.qualifications = this.user.qualifications;
        this.role = this.user.role;
        this.birthDate = this.user.birthDate;
        this.email = this.user.email;
        this.mobile = this.user.mobile;
        this.profileImageUrl = this.user.profileImage;
      });
  }

  async updatePersonsalInformation() {
    this.personalInformationLoader = true;
    if(this.profileImage != undefined) {
      const file = this.profileImage;
      const path = _utils.ROUTE_STAFF + "/" + this.documentId + "/profileImage";
      const storageRef = this.storageRef.ref(path);
      const upload = this.storageRef.upload(path, file);

      await upload.snapshotChanges().pipe().toPromise().then(() => {
        return storageRef.getDownloadURL().toPromise().then(url => {
          this.profileImage = url;
        })
      })
    }

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_STAFF}`).doc(this.documentId)
      .update({
        fname: this.firstName.toLowerCase(),
        lname: this.lastName?.toLocaleLowerCase() || "",
        mobile: this.mobile,
        department: this.role == 1 ? this.department : "",
        designation: this.role == 1 ? this.designation : "",
        role: this.role,
        salutation: this.salutation,
        birthDate: this.birthDate,
        gender: this.gender,
        address: this.address,
        profileImage: this.profileImage || this.profileImageUrl,
        updatedOn: new Date()
      })
      .then(() => {
        this.personalInformationLoader = false;
        (<HTMLInputElement>document.getElementById('profileImage')).value = null;
        this.snackbar.open("Personal Information Updated Successfully", "", {
          duration: 2500,
          panelClass: ['success']
        });
      })
      .catch(() => {
        this.personalInformationLoader = false;
        this.snackbar.open("Something went wrong !! Please try again", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      })
  }

  async updateQualification() {
    this.qualificationLoader = true;
    let finalQual = [];

    // Checking Everything is Ok
    for(let qual of this.qualifications) {
      if(qual.certificateImageUrl == undefined) {
        this.qualifications[this.qualifications.findIndex(x => x == qual)].certificateImageUrl = "";
      }
      if(qual.qualificationName == undefined || qual.qualificationYear == undefined) {
        this.snackbar.open("Name or Year or Image is not entered in one of the qualification " + (this.qualifications.indexOf(qual) + 1).toString(), "", {
          duration: 2500,
          panelClass: ['success']
        });
        this.qualificationLoader = false;
        return;
      }
    }

    for(let qual of this.qualifications) {
      if (qual.certificate == undefined) {
        if (qual.certificateImageUrl != null || qual.certificateImageUrl != "") {
          finalQual.push({ ...qual });
        }
      } else {
        const file = qual.certificate;
        const path = _utils.ROUTE_STAFF + "/" + this.documentId + "/" + _utils.ROUTE_QUALIFICATION + "/" + qual.certificate.name;
        const storageRef = this.storageRef.ref(path);
        const upload = this.storageRef.upload(path, file);

        await upload.snapshotChanges().pipe().toPromise().then(() => {
          return storageRef.getDownloadURL().toPromise().then(url => {
            qual.certificateImageUrl = url || "";
          });
        });

        finalQual.push({
          qualificationName: qual.qualificationName,
          qualificationYear: qual.qualificationYear,
          certificateImageUrl: qual.certificateImageUrl
        });
      }
    }

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_STAFF}`).doc(this.documentId)
      .update({
        qualifications: finalQual,
        updatedOn: new Date()
      })
      .then(() => {
        this.qualificationLoader = false;
        this.snackbar.open("Qualification Updated Successfully", "", {
          duration: 2500,
          panelClass: ['success']
        });
      })
      .catch(() => {
        this.qualificationLoader = false;
        this.snackbar.open("Something went wrong !! Please try again", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      });
  }

  async updateExperiences() {
    this.experiencesLoader = true;
    let finalExperiences = [];

    for(let exp of this.experiences) {
      if(exp.currentOccupation) {
        this.experiences[this.experiences.findIndex(x => x == exp)].endDate = new Date();
      }
      if(exp.certificateImageUrl == undefined) {
        this.experiences[this.experiences.findIndex(x => x == exp)].certificateImageUrl = "";
      }
      if(exp.experienceName == undefined || exp.startDate == null || exp.endDate == null) {
        this.snackbar.open("Name or Starting Date or Ending Date is not entered in one of the experience " + (this.experiences.indexOf(exp) + 1).toString(), "", {
          duration: 2500,
          panelClass: ['success']
        });
        this.experiencesLoader = false;
        return;
      }
    }

    for(let exp of this.experiences) {
      if(exp.certificate == undefined) {
        if(exp.certificateImageUrl != null || exp.certificateImageUrl != "") {
          finalExperiences.push({ ...exp });
        }
      } else {
        const file = exp.certificate;
        const path = _utils.ROUTE_STAFF + "/" + this.documentId + "/" + _utils.ROUTE_EXPERIENCES+ "/" + exp.certificate.name;
        const storageRef = this.storageRef.ref(path);
        const upload = this.storageRef.upload(path, file);

        await upload.snapshotChanges().pipe().toPromise().then(() => {
          return storageRef.getDownloadURL().toPromise().then(url => {
            exp.certificateImageUrl = url || "";
          });
        });

        finalExperiences.push({
          experienceName: exp.experienceName,
          startDate: exp.startDate,
          endDate: exp.endDate,
          currentOccupation: exp.currentOccupation,
          certificateImageUrl: exp.certificateImageUrl
        });
      }
    }

    this.dbRef.collection(`${_utils.MAIN}/${_utils.MAIN}/${_utils.COLLECTION_STAFF}`).doc(this.documentId)
      .update({
        experiences: finalExperiences,
        updatedOn: new Date()
      })
      .then(() => {
        this.experiencesLoader = false;
        this.snackbar.open("Experiences Updated Successfully", "", {
          duration: 2500,
          panelClass: ['success']
        });
      })
      .catch(() => {
        this.experiencesLoader = false;
        this.snackbar.open("Something went wrong !! Please try again", "", {
          duration: 2500,
          panelClass: ['warning']
        });
      });

  }

  addQualification() {
    let obj: Qualification = new Qualification();
    if (this.qualifications == undefined) {
      this.qualifications = [];
      this.qualifications.push({ ...obj });
    } else {
      this.qualifications.push({ ...obj });
    }
  }

  addExperience() {
    let obj: Experience = new Experience();
    // obj.experienceName = "";
    // obj.certificate = null;
    // obj.certificateImageUrl = "";
    // obj.currentOccupation = false;
    obj.startDate = new Date();
    obj.endDate = new Date();

    if (this.experiences == undefined) {
      this.experiences = [];
      this.experiences.push({ ...obj });
    } else {
      this.experiences.push({ ...obj });
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
        duration: 2500
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
        duration: 2500
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
        duration: 2500
      });
      return;
    }
  }

  removeQualification(index) {
    this.qualifications.splice(index, 1);
  }

  removeExperience(index) {
    this.experiences.splice(index, 1);
  }
}
