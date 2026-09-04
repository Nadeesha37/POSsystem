import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainTemplateComponent } from './core/main-template/main-template.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserListComponent } from './features/user-profile/user-list/user-list.component';
import { CreateUserComponent } from './features/user-profile/create-user/create-user.component';
import { LoginDtlRptComponent } from './features/reports/login-dtl-rpt/login-dtl-rpt.component';

const routes: Routes = [

  {
    path: '',
    component: MainTemplateComponent,
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'users',
        component: UserListComponent
      },

      {
        path: 'users/create',
        component: CreateUserComponent
      },

      {
        path: 'reports',
        component: LoginDtlRptComponent
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
