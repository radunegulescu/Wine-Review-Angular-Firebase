import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Wine } from '../models/wine.model';
import { WineService } from '../services/wine.service';

@Component({
  selector: 'app-create-wine',
  templateUrl: './create-wine.component.html',
  styleUrls: ['./create-wine.component.scss']
})
export class CreateWineComponent implements OnInit {

  addWineForm!: FormGroup;
  imgSrc: string;
  selectedImage: any = null;
  wine: Wine = new Wine();

  constructor(private storage: AngularFireStorage, private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, private wineService: WineService) {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
  }

  ngOnInit(): void {

    this.addWineForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required),
      'imageUrl': new FormControl('', Validators.required),
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

  addWine(formValue: any) {
    if (this.addWineForm.invalid)                            // if there's an error in the form, don't submit it
      return;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let emailLower = user.email?.toLowerCase();
        console.log(emailLower);
        this.wine.producerEmail = emailLower!;
      }
    });
    var filePath = `winesImages/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.wine.imageUrl = url;
          this.wine.name = formValue.name;
          this.wine.type = formValue.type;
          this.wineService.createWine(this.wine);
          this.router.navigate(['home']);
        })
      })
    ).subscribe();
  }

  get formControls() {
    return this.addWineForm['controls'];
  }

}
