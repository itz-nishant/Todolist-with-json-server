import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', data: { title: 'Login' } },
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: { title: 'Login' } },
  { path: 'signup', component: SignupComponent, data: { title: 'Signup' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] ,data: { title: 'Dashboard' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Forgot Password' } },
  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
