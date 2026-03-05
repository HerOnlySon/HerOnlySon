import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeEnZa from '@angular/common/locales/en-ZA';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LandingComponent } from './pages/landing/landing.component';

registerLocaleData(localeEnZa);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileComponent,
    InsuranceComponent,
    ReportsComponent,
    SigninComponent,
    SignupComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-ZA' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
