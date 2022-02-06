import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  ratingsCollection!: AngularFirestoreCollection<Rating>;
  rating!: Rating;

  constructor(private firestore: AngularFirestore) { }

  ratingExists(userEmail: string | undefined, wineId: string): boolean {
    console.log(userEmail);
    console.log(wineId);
    let exists = false;
    const ratingRef = this.firestore.collection("/ratings").doc(wineId + "*" + userEmail);
    ratingRef.get().toPromise().then((docSnapShot) => {
      exists = docSnapShot.exists;
      console.log(exists + "yes");
      return exists;
    })
    console.log(exists);
    return exists;
  }

  getRating(userEmail: string | undefined, wineId: string) {
    const ratingRef = this.firestore.collection("/ratings").doc(wineId + "*" + userEmail);
    ratingRef.get().toPromise().then((docSnapShot) => {
      if (docSnapShot.exists) {
        let ratingOBS = ratingRef.snapshotChanges().pipe(map(action => {
          const data = action.payload.data() as Rating;
          const id = action.payload.id;
          return { id, ...data };
        }));;
        ratingOBS.subscribe(r => {
          this.rating = r;
        })
      }
    })
    return this.rating;
  }

  editRating(rating: Rating) {
    this.firestore.doc('/ratings/' + rating.wineId + "*" + rating.userEmail)
      .set({
        acidity: rating.acidity,
        body: rating.body,
        fruit: rating.fruit,
        tannin: rating.tannin,
        wineId: rating.wineId,
        userEmail: rating.userEmail
      });
  }
}
