import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainTemplateComponent } from './core/main-template/main-template.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserListComponent } from './features/user-profile/user-list/user-list.component';
import { CreateUserComponent } from './features/user-profile/create-user/create-user.component';
import { LoginDtlRptComponent } from './features/reports/login-dtl-rpt/login-dtl-rpt.component';
import { LoginComponent } from './features/login/login.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    MainTemplateComponent,
    DashboardComponent,
    UserListComponent,
    CreateUserComponent,
    LoginDtlRptComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
