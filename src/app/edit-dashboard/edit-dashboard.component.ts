import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-dashboard',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.scss']
})
export class EditDashboardComponent implements OnInit {
  editDashboardForm!: FormGroup;
  user: Observable<any>;

  constructor(private router: Router, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user = null!;
  }

  ngOnInit(): void {
    this.editDashboardForm = new FormGroup({
      'displayName': new FormControl(''),
      'birthdate': new FormControl(''),
    });
    this.afAuth.authState.subscribe(user => {
      console.log('Dashboard: user', user);

      if (user) {
        this.editDashboardForm.controls['displayName'].setValue(user.displayName);
        this.editDashboardForm.controls['birthdate'].setValue(user);
        let emailLower = user.email?.toLowerCase();
        this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
        this.firestore.collection('users').doc(emailLower).get().toPromise().then(snapshot => {
          this.editDashboardForm.controls['displayName'].setValue(snapshot.get("displayName"));
          this.editDashboardForm.controls['birthdate'].setValue(snapshot.get("birthdate"));
        })
      }
    });
  }

  editDashboard() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let emailLower = user.email?.toLowerCase();
        this.firestore.collection('users').doc(emailLower).update({
          displayName: this.editDashboardForm.value.displayName,
          birthdate: this.editDashboardForm.value.birthdate
        });
        this.router.navigate(['/dashboard']);
      }
    });
  }

}
