import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      console.log(route.routeConfig?.path);

      this.afAuth.onAuthStateChanged((user) => {
        if (user) {


          let emailLower = user.email?.toLowerCase();

          this.firestore.collection('users').doc(emailLower).get().toPromise().then(snapshot => {
            if (snapshot.get("accountType") == "endUser") {
              resolve(true);
            }
            else {
              console.log('Auth Guard: user is not endUser');
              this.router.navigate(['/home']);
              resolve(false);
            }
          })
        } else {
          console.log('Auth Guard: user is not logged in');
          this.router.navigate(['/home']);                   // a logged out user will always be sent to home
          resolve(false);
        }
      });
    });
  }
}
