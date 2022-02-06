import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  email: string;
  mailSent: boolean;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, public afAuth: AngularFireAuth) {
    this.email = '';
    this.mailSent = false;

    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {               // if the user is logged in, update the form value with their email address
      if (user) {
        this.email = user.email!;
      }
    });
  }

  resendVerificationEmail() {

    this.authService.resendVerificationEmail().then((result) => {
      if (result == null) {                               // null is success, false means there was an error
        console.log('verification email resent...');
        this.mailSent = true;
      }
      else if (result.isValid == false) {
        console.log('verification error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }

}
