import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { EditDashboardComponent } from './edit-dashboard/edit-dashboard.component';
import { EditProfilePictureComponent } from './edit-profile-picture/edit-profile-picture.component';
import { CreateWineComponent } from './create-wine/create-wine.component';
import { ProducerGuard } from './services/producer.guard';
import { ListWinesComponent } from './list-wines/list-wines.component';
import { RateWineComponent } from './rate-wine/rate-wine.component';
import { UserGuard } from './services/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'edit-dashboard', component: EditDashboardComponent, canActivate: [AuthGuard] },
  { path: 'edit-profile-picture', component: EditProfilePictureComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [AuthGuard] },
  { path: 'create-wine', component: CreateWineComponent, canActivate: [ProducerGuard] },
  { path: 'list-wines', component: ListWinesComponent, canActivate: [AuthGuard] },
  { path: 'rate/:id', component: RateWineComponent, canActivate: [UserGuard] },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
