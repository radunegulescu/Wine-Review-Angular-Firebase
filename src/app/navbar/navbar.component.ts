import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: Observable<any>;              // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore, public router: Router) {
    this.user = null!;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {                                                   // grab the user object from Firebase Authorization
      if (user) {
        let emailLower = user.email?.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();      // get the user's doc in Cloud Firestore
      }
    });
  }

  logout(): void {
    this.afAuth.signOut();
    this.router.navigate(['/home']);
  }

  consoleLog(): void {
    console.log(this.router.url);
  }

}
