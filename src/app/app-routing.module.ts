import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent, data: { animation: 'Landing' } },
  { path: 'signin', component: SigninComponent, data: { animation: 'Signin' } },
  { path: 'signup', component: SignupComponent, data: { animation: 'Signup' } },
  { path: 'dashboard', component: DashboardComponent, data: { animation: 'Dashboard' } },
  { path: 'profile', component: ProfileComponent, data: { animation: 'Profile' } },
  { path: 'insurance', component: InsuranceComponent, data: { animation: 'Insurance' } },
  { path: 'reports', component: ReportsComponent, data: { animation: 'Reports' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
