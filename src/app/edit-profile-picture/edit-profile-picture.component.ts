import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile-picture',
  templateUrl: './edit-profile-picture.component.html',
  styleUrls: ['./edit-profile-picture.component.scss']
})
export class EditProfilePictureComponent implements OnInit {
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  user: Observable<any>;


  editProfiePictureForm = new FormGroup({
    imageUrl: new FormControl('', Validators.required)
  })

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, private router: Router, private afAuth: AngularFireAuth) {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.isSubmitted = false;
    this.user = null!;
  }

  ngOnInit() {
    this.resetForm();
    this.afAuth.authState.subscribe(user => {
      console.log('Dashboard: user', user);

      if (user) {
        let emailLower = user.email?.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
      }
    });
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  editProfilePicture(formValue: any) {
    this.isSubmitted = true;
    if (this.editProfiePictureForm.valid) {
      var filePath = `profilePictures/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.afAuth.authState.subscribe(user => {
              if (user) {
                let emailLower = user.email?.toLowerCase();
                this.firestore.collection('users').doc(emailLower).update({
                  imageUrl: url
                });
              }
            });
            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

  get formControls() {
    return this.editProfiePictureForm['controls'];
  }

  resetForm() {
    this.editProfiePictureForm.reset();
    this.editProfiePictureForm.setValue({
      imageUrl: '',
    });
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}
