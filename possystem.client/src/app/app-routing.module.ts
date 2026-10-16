import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainTemplateComponent } from './core/main-template/main-template.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserListComponent } from './features/user-profile/user-list/user-list.component';
import { CreateUserComponent } from './features/user-profile/create-user/create-user.component';
import { LoginDtlRptComponent } from './features/reports/login-dtl-rpt/login-dtl-rpt.component';
import { LoginComponent } from './features/login/login.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';

import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';
import { roleGuard } from './core/role.guard';
import { ACCESS } from './core/models/user.model';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: '',
    component: MainTemplateComponent,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'users',
        component: UserListComponent,
        canActivate: [roleGuard],
        data: { roles: ACCESS.users }
      },

      {
        path: 'users/create',
        component: CreateUserComponent,
        canActivate: [roleGuard],
        data: { roles: ACCESS.users }
      },

      {
        path: 'reports',
        component: LoginDtlRptComponent,
        canActivate: [roleGuard],
        data: { roles: ACCESS.reports }
      },

      { path: 'forbidden', component: ForbiddenComponent }

    ]
  },

  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
