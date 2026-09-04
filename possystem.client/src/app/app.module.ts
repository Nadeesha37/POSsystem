import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainTemplateComponent } from './core/main-template/main-template.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserListComponent } from './features/user-profile/user-list/user-list.component';
import { CreateUserComponent } from './features/user-profile/create-user/create-user.component';
import { LoginDtlRptComponent } from './features/reports/login-dtl-rpt/login-dtl-rpt.component';

@NgModule({
  declarations: [
    AppComponent,
    MainTemplateComponent,
    DashboardComponent,
    UserListComponent,
    CreateUserComponent,
    LoginDtlRptComponent,
    LoginDtlRptComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
