import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  mailSent: boolean;
  forgotPasswordForm: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private afAuth: AngularFireAuth) {
    this.mailSent = false;

    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email])
    });

    this.firebaseErrorMessage = '';
  }
  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {               // if the user is logged in, update the form value with their email address
      if (user) {
        this.forgotPasswordForm.patchValue({
          email: user.email
        });
      }
    });
  }

  retrievePassword() {

    if (this.forgotPasswordForm.invalid)
      return;

    this.authService.resetPassword(this.forgotPasswordForm.value.email).then((result) => {
      if (result == null) {                               // null is success, false means there was an error
        console.log('password reset email sent...');
        this.mailSent = true;
      }
      else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    });
  }


}
