import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuard} from "./shared/auth.guard";
import {PostGrievanceComponent} from "./post-grievance/post-grievance.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AllUsersComponent} from "./all-users/all-users.component";
import {ApprovalRequestComponent} from "./approval-request/approval-request.component";
import {AccountComponent} from "./account/account.component";
import {MyGrievanceComponent} from "./my-grievance/my-grievance.component";
import {UserGuard} from "./shared/user.guard";
import {AdminGuard} from "./shared/admin.guard";
import {ErrorComponent} from "./error/error.component";
import {BodyComponent} from "./body/body.component";

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {
    path: 'user',
    component: DashboardComponent,
    canActivate: [AuthGuard, UserGuard],
    children: [
      {path: 'dashboard', component: BodyComponent, canActivate: [AuthGuard]},
      {path: 'post-grievance', component: PostGrievanceComponent, canActivate: [AuthGuard, UserGuard]},
      {path: 'account', component: AccountComponent, canActivate: [AuthGuard, UserGuard]},
      {path: 'my-grievances', component: MyGrievanceComponent, canActivate: [AuthGuard, UserGuard]},
    ]
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard]},
      {path: 'users', component: AllUsersComponent, canActivate: [AuthGuard, AdminGuard]},
      {path: 'user-approval-request', component: ApprovalRequestComponent, canActivate: [AuthGuard, AdminGuard]},
      {path: 'pending-grievances', component: BodyComponent, canActivate: [AuthGuard, AdminGuard]},
      {path: 'account', component: AccountComponent, canActivate: [AuthGuard, AdminGuard]},
    ]
  },
  {path: '**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
