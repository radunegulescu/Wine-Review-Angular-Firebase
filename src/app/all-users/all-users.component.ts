import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  users: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.users = null!;
  }

  ngOnInit(): void {
    this.users = this.firestore.collection('users').valueChanges();
  }

  makeProducer(emailLower: string): void {
    this.firestore.collection('users').doc(emailLower).update({
      accountType: "producer"
    });
  }

  makeEndUser(emailLower: string): void {
    this.firestore.collection('users').doc(emailLower).update({
      accountType: "endUser"
    });
  }
}
