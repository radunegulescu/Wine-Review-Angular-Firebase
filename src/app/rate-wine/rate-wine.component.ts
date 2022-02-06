import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rating } from '../models/rating.model';
import { RatingService } from '../services/rating.service';

@Component({
  selector: 'app-rate-wine',
  templateUrl: './rate-wine.component.html',
  styleUrls: ['./rate-wine.component.scss']
})
export class RateWineComponent implements OnInit {
  editRatingForm!: FormGroup;
  wineId!: string;
  userEmail: string | undefined;
  oldRating!: Rating;
  user: Observable<any>;

  constructor(private firestore: AngularFirestore, private router: ActivatedRoute, private afAuth: AngularFireAuth, private ratingService: RatingService) {
    this.user = null!;
  }

  ngOnInit(): void {
    this.editRatingForm = new FormGroup({
      'acidity': new FormControl(''),
      'body': new FormControl(''),
      'fruit': new FormControl(''),
      'tannin': new FormControl(''),
    });
    this.wineId = this.router.snapshot.params.id;
    this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
      if (user) {
        this.userEmail = user.email?.toLowerCase();
        this.user = this.firestore.collection('users').doc(this.userEmail).valueChanges();
        this.firestore.collection('users').doc(this.userEmail).get().toPromise().then(snapshot => {
          this.userEmail = snapshot.get("email_lower");
          console.log(this.userEmail);
          console.log(this.wineId);
          const ratingRef = this.firestore.collection("/ratings").doc(this.wineId + "*" + this.userEmail);
          ratingRef.get().toPromise().then((docSnapShot) => {
            if (docSnapShot.exists) {

              let ratingOBS = ratingRef.snapshotChanges().pipe(map(action => {
                const data = action.payload.data() as Rating;
                const id = action.payload.id;
                return { id, ...data };
              }));;
              ratingOBS.subscribe(r => {
                console.log("da");
                this.oldRating = r;
                this.editRatingForm.controls['acidity'].setValue(this.oldRating.acidity);
                this.editRatingForm.controls['body'].setValue(this.oldRating.body);
                this.editRatingForm.controls['fruit'].setValue(this.oldRating.fruit);
                this.editRatingForm.controls['tannin'].setValue(this.oldRating.tannin);
              })
            }
          })
        })
      }
    });
    console.log(this.wineId);
    console.log(this.userEmail);
  }

  saveRating() {
    console.log(this.oldRating);
    let newRating: Rating = new Rating();
    newRating.acidity = this.editRatingForm.value.acidity;
    newRating.body = this.editRatingForm.value.body;
    newRating.fruit = this.editRatingForm.value.fruit;
    newRating.tannin = this.editRatingForm.value.tannin;
    newRating.userEmail = this.userEmail;
    newRating.wineId = this.wineId;

    this.firestore.collection('wines').doc(newRating.wineId).get().toPromise().then(snapshot => {
      let numberOfRatings = snapshot.get("numberOfRatings");

    })

    if (this.oldRating == undefined) {
      console.log("oldRating nu exista");
      this.firestore.collection('wines').doc(newRating.wineId).get().toPromise().then(snapshot => {
        let oldNumberOfRatings = snapshot.get("numberOfRatings");
        let oldAcidity = snapshot.get("acidity");
        let oldBody = snapshot.get("body");
        let oldFruit = snapshot.get("fruit");
        let oldTannin = snapshot.get("tannin");
        console.log("NumberOfRatings vechi: " + oldNumberOfRatings);
        console.log("Acidity vechi: " + oldAcidity);
        console.log("Acidity nou: " + newRating.acidity);
        console.log("NumberOfRatings nou: " + (oldNumberOfRatings + 1));
        console.log("Medie acidity noua: " + ((oldAcidity * oldNumberOfRatings + newRating.acidity) / (oldNumberOfRatings + 1)));
        this.firestore.collection('wines').doc(newRating.wineId).update({
          numberOfRatings: oldNumberOfRatings + 1,
          acidity: (oldAcidity * oldNumberOfRatings + newRating.acidity) / (oldNumberOfRatings + 1),
          body: (oldBody * oldNumberOfRatings + newRating.body) / (oldNumberOfRatings + 1),
          fruit: (oldFruit * oldNumberOfRatings + newRating.fruit) / (oldNumberOfRatings + 1),
          tannin: (oldTannin * oldNumberOfRatings + newRating.tannin) / (oldNumberOfRatings + 1),
        });
      })
    }
    else {
      console.log("oldRating exista");
      let oldAcidityRating = this.oldRating.acidity;
      let oldBodyRating = this.oldRating.body;
      let oldFruitRating = this.oldRating.fruit;
      let oldTanninRating = this.oldRating.tannin;
      console.log("!!!!" + oldAcidityRating);
      this.firestore.collection('wines').doc(newRating.wineId).get().toPromise().then(snapshot => {
        let oldNumberOfRatings = snapshot.get("numberOfRatings");
        let oldAcidity = snapshot.get("acidity");
        let oldBody = snapshot.get("body");
        let oldFruit = snapshot.get("fruit");
        let oldTannin = snapshot.get("tannin");
        console.log("NumberOfRatings vechi: " + oldNumberOfRatings);
        console.log("Acidity vechi: " + oldAcidity);
        console.log("Acidity nou: " + newRating.acidity);
        console.log("Medie acidity noua: " + ((oldAcidity * oldNumberOfRatings + newRating.acidity - this.oldRating.acidity) / (oldNumberOfRatings)));
        console.log("Acidity de rating vechi: " + this.oldRating.acidity);
        console.log("!!!!" + oldAcidityRating);
        this.firestore.collection('wines').doc(newRating.wineId).update({
          acidity: (oldAcidity * oldNumberOfRatings + newRating.acidity - oldAcidityRating) / (oldNumberOfRatings),
          body: (oldBody * oldNumberOfRatings + newRating.body - oldBodyRating) / (oldNumberOfRatings),
          fruit: (oldFruit * oldNumberOfRatings + newRating.fruit - oldFruitRating) / (oldNumberOfRatings),
          tannin: (oldTannin * oldNumberOfRatings + newRating.tannin - oldTanninRating) / (oldNumberOfRatings),
        });
      })
    }

    this.ratingService.editRating(newRating);
  }

}
