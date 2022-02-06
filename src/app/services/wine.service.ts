import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Wine } from '../models/wine.model';

@Injectable({
  providedIn: 'root'
})
export class WineService {

  constructor(private firestore: AngularFirestore) { }

  getWineDoc(id: string) {
    return this.firestore.collection('wines').doc(id).valueChanges();
  }

  getWinesList() {
    return this.firestore.collection("wines").snapshotChanges();
  }

  createWine(wine: Wine) {
    console.log(wine.producerEmail);
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection('wines').add(Object.assign({}, wine)).then(response => {
        console.log(response)
      }, error => reject(error));
    });
  }

  deleteWine(wine: any) {
    console.log(wine.id)
    return this.firestore.collection('wines').doc(wine.id).delete();
  }

  updateWine(wine: Wine, id: string) {
    return this.firestore.collection('wines').doc(id).update({
      name: wine.name,
      type: wine.type,
      fruit: wine.fruit,
      acidity: wine.acidity,
      tannin: wine.tannin,
      body: wine.body,
    });
  }
}
