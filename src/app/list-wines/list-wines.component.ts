import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Wine } from '../models/wine.model';
import { WineService } from '../services/wine.service';
import { map } from 'rxjs/operators';
import { Rating } from '../models/rating.model';

@Component({
  selector: 'app-list-wines',
  templateUrl: './list-wines.component.html',
  styleUrls: ['./list-wines.component.scss']
})
export class ListWinesComponent implements OnInit {

  wines: Observable<any>;
  user: Observable<any>;
  ratings: Observable<any>;
  winesCollection!: AngularFirestoreCollection;


  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore, private wineService: WineService) {
    this.wines = null!;
    this.user = null!;
    this.ratings = null!;
  }

  ngOnInit(): void {
    this.wines = this.firestore.collection('wines').snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Wine;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    this.ratings = this.firestore.collection('ratings').snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Rating;
        return data;
      });
    }));

    this.afAuth.authState.subscribe(user => {
      if (user) {
        let emailLower = user.email?.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      }
    });
  }

  delete(wine: any): void {
    this.wineService.deleteWine(wine);
  }

}
