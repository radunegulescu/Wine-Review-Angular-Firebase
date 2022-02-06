import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  firebaseErrorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    if (this.authService.userLoggedIn) {                       // if the user's logged in, navigate them to the dashboard (NOTE: don't use afAuth.currentUser -- it's never null)
      this.router.navigate(['/dashboard']);
    }

    this.signupForm = new FormGroup({
      'displayName': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required),
      'accountType': new FormControl('', Validators.required)
    });

  }

  signup() {
    if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
      return;

    this.authService.signupUser(this.signupForm.value).then((result) => {
      if (result == null)                                 // null is success, false means there was an error
        this.router.navigate(['/dashboard']);
      else if (result.isValid == false)
        this.firebaseErrorMessage = result.message;
    })
  }
}
